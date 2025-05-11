import { eq, sql } from "drizzle-orm";
import {
	gold,
	leaderboards,
	nexus,
	outcomes,
	predictions,
	xp,
} from "../schema/public";
import { db } from "..";

const predictionInputs = [
	{
		id: 77,
		winningOutcomes: [217, 219],
	},
];

for (const predictionInput of predictionInputs) {
	await db.primary.transaction(async (tx) => {
		const prediction = await db.primary.query.predictions.findFirst({
			where: (t, { eq }) => eq(predictions.id, predictionInput.id),
			with: {
				outcomes: {
					with: {
						bets: true,
					},
				},
			},
		});

		if (!prediction) {
			throw new Error("Prediction not found");
		}

		if (!prediction.closed) {
			throw new Error("Prediction must be closed before resolving");
		}

		if (prediction.resolved) {
			throw new Error("Prediction already resolved");
		}

		const now = new Date();

		const winningOutcomes = prediction.outcomes.filter((outcome) =>
			predictionInput.winningOutcomes.includes(outcome.id),
		);
		const losingOutcomes = prediction.outcomes.filter(
			(outcome) => !predictionInput.winningOutcomes.includes(outcome.id),
		);

		console.log(
			winningOutcomes.map((o) => o.id),
			losingOutcomes.map((o) => o.id),
		);

		const losingPool = losingOutcomes.reduce(
			(acc, outcome) => acc + Number(outcome.pool),
			0,
		);
		const splitLosingPool = losingPool / winningOutcomes.length;
		const totalUserWinnings: Record<string, number> = {};

		for (const winningOutcome of winningOutcomes) {
			const outcomeStakedPool = Number(winningOutcome.pool);
			const winningPool = outcomeStakedPool + splitLosingPool;
			const outcomeBetsPerUser: Record<string, number> = {};

			for (const bet of winningOutcome.bets) {
				outcomeBetsPerUser[bet.user] =
					(outcomeBetsPerUser[bet.user] ?? 0) + Number(bet.amount);
			}

			const outcomeTotalStakes = Object.values(outcomeBetsPerUser).reduce(
				(a, b) => a + b,
				0,
			);

			for (const [user, stake] of Object.entries(outcomeBetsPerUser)) {
				const share = stake / outcomeTotalStakes;
				const winnings = Number(share * winningPool);

				totalUserWinnings[user] = (totalUserWinnings[user] ?? 0) + winnings;
			}
		}

		for (const winningOutcome of winningOutcomes) {
			await tx
				.update(outcomes)
				.set({
					result: true,
				})
				.where(eq(outcomes.id, winningOutcome.id));
		}

		for (const losingOutcome of losingOutcomes) {
			await tx
				.update(outcomes)
				.set({
					result: false,
				})
				.where(eq(outcomes.id, losingOutcome.id));
		}

		await tx
			.update(predictions)
			.set({
				resolved: true,
			})
			.where(eq(predictions.id, prediction.id));

		for (const [user, winnings] of Object.entries(totalUserWinnings)) {
			await tx
				.update(nexus)
				.set({
					gold:
						winnings > 0
							? sql`${nexus.gold} + ${winnings.toFixed(2)}`
							: undefined,
					xp: sql`${nexus.xp} + ${prediction.xp}`,
				})
				.where(eq(nexus.id, user));

			await tx.insert(xp).values({
				user,
				amount: prediction.xp,
				prediction: prediction.id,
				timestamp: now,
				community: prediction.community,
			});

			await tx
				.insert(leaderboards)
				.values({
					user,
					xp: prediction.xp,
					community: prediction.community,
				})
				.onConflictDoUpdate({
					target: [leaderboards.user, leaderboards.community],
					set: {
						xp: sql`${leaderboards.xp} + ${prediction.xp}`,
					},
				});

			if (winnings > 0) {
				await tx.insert(gold).values({
					to: user,
					amount: winnings.toFixed(2),
					prediction: prediction.id,
					timestamp: now,
				});
			}
		}
	});
}
