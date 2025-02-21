import { env } from "~/env";
import { createJob } from "../createJob";
import { and, lt, eq, sql, asc, gt, desc } from "drizzle-orm";
import { db, gold, nexus, rankings, xp, ranks } from "~/packages/db/schema";

// Ranking System
// Each week on friday at 1:50pm CST, the leaderboard is refreshed
// The leaderboard is calculated by giving each user a score based on the sum xp earned within the period averaged with their score from the previous period
//  - If a user scored 5k last period and 1k this period, their score would be 3k. If a user scored 1k last period and 0 this period, their score would be 500.
//  - This degrades their score over time (at most -50% a period) and dampens the impact of volatile increases in scores in a given period
// New users are given the lowest rank but won't be placed on the leaderboard until they earn xp
// Users whos average score is 0, or whos previous score is < 100 & current score is 0 are excluded from the rank distribution and are assumed the lowest rank
// Everyone else is placed in a rank based on their averaged score and the distribution of ranks

export const refreshLeaderboard = createJob({
	name: "Refresh Leaderboard",
	cron: "50 13 * * 5", // 1:50pm CST every Friday
	execute: async () => {
		const now = new Date();

		console.log("Starting leaderboard refresh");

		const [currentLeaderboard, xpEarned, activeRanks] = await Promise.all([
			// The most recent leaderboard
			db.query.rankings.findMany({
				where: eq(
					rankings.timestamp,
					sql`(SELECT MAX(timestamp) FROM ${rankings})`,
				),
				orderBy: desc(rankings.score),
				columns: {
					id: true,
					user: true,
					score: true,
				},
			}),
			// All xp earned after the most recent leaderboard was created
			db.query.xp.findMany({
				where: gt(xp.timestamp, sql`(SELECT MAX(timestamp) FROM ${rankings})`),
				columns: {
					amount: true,
					user: true,
				},
			}),
			// All active ranks
			db.query.ranks.findMany({
				where: eq(ranks.active, true),
				orderBy: desc(ranks.place),
			}),
		]);

		console.log("ranks", activeRanks);

		const xpEarnedByUsers: Record<string, number> = {};

		console.log("Calculating xp earned by users");

		for (const xp of xpEarned) {
			xpEarnedByUsers[xp.user] = (xpEarnedByUsers[xp.user] ?? 0) + xp.amount;
		}

		// Make sure we tally all users from the previous leaderboard
		for (const ranking of currentLeaderboard) {
			if (xpEarnedByUsers[ranking.user] === undefined) {
				xpEarnedByUsers[ranking.user] = 0;
			}
		}

		console.log("Calculating new leaderboard");

		const leaderboard = Object.entries(xpEarnedByUsers)
			.map(([user, xp]) => {
				const previousRanking = currentLeaderboard.find(
					(ranking) => ranking.user === user,
				);

				const previousScore = previousRanking?.score ?? 0;

				let score = previousScore + xp;

				// Decay the score, but give a grace period for new scores
				if (previousScore > 0 || xp > 2500) {
					score /= 2;
				}

				return {
					user,
					score,
				};
			})
			.toSorted((a, b) => b.score - a.score);

		console.log("leaderboard", leaderboard);

		await db.transaction(async (tx) => {
			// const eligibleForRank = leaderboard.filter((user) => user.score >= 100);
			// const ineligibleForRank = leaderboard.filter((user) => user.score < 100);

			// Institute this later when theres enough ways to regularly earn xp
			// If the users score dropped below 100, set their rank to the lowest and skip
			// for (const ranking of ineligibleForRank) {

			// 	console.log("skipping and setting rank to lowest", leaderboard[i].user);
			// 	await tx
			// 		.update(nexus)
			// 		.set({
			// 			rank: activeRanks[0].id,
			// 		})
			// 		.where(eq(nexus.id, leaderboard[i].user));
			// 	continue;
			// }

			for (let i = 0; i < leaderboard.length; i++) {
				const percentile = i / leaderboard.length;

				let rank = activeRanks[0]; // Default to highest rank
				let percentileSum = 0;

				for (const possibleRank of activeRanks) {
					percentileSum += Number(possibleRank.percentile);
					if (percentile <= percentileSum) {
						rank = possibleRank;
						break;
					}
				}

				console.log("setting rank", leaderboard[i].score, rank.name);

				await tx
					.update(nexus)

					.set({
						rank: rank.id,
					})
					.where(eq(nexus.id, leaderboard[i].user));

				const [rankingRecord] = await tx
					.insert(rankings)
					.values({
						rank: rank.id,
						timestamp: now,
						user: leaderboard[i].user,
						score: Math.floor(leaderboard[i].score),
					})
					.returning({ id: rankings.id });

				const eligibleForGold = 100;
				const potOfGold = 50_000;

				if (i < eligibleForGold) {
					const goldEarned = generateEarning({
						pot: potOfGold,
						participants: eligibleForGold,
						index: i,
					});

					console.log("Distributing gold", i, leaderboard[i].user, goldEarned);

					const [goldRecord] = await tx
						.insert(gold)
						.values({
							amount: goldEarned.toString(),
							timestamp: now,
							to: leaderboard[i].user,
							ranking: rankingRecord.id,
						})
						.returning({ id: gold.id });

					await tx
						.update(rankings)
						.set({
							gold: goldRecord.id,
						})
						.where(eq(rankings.id, rankingRecord.id));

					await tx
						.update(nexus)
						.set({
							gold: sql`${nexus.gold} + ${goldEarned}`,
						})
						.where(eq(nexus.id, leaderboard[i].user));
				}
			}
		});

		console.log("Leaderboard successfully refreshed");
	},
});

function generateEarning(input: {
	pot: number;
	participants: number;
	index: number;
}): number {
	const decay = 5 / input.participants;

	// Calculate value at this index
	const value = Math.exp(-decay * input.index);

	// Calculate sum of all values to get total
	let total = 0;
	for (let i = 0; i < input.participants - 1; i++) {
		total += Math.exp(-decay * i);
	}

	return Number((value * (input.pot / total)).toFixed(2));
}
