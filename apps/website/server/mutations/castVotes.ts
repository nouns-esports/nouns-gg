"use server";

import {
	votes,
	proposals,
	rounds,
	xp,
	nexus,
	leaderboards,
	snapshots,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { onlyUser } from ".";
import { getAction } from "../actions";
import { posthogClient } from "../clients/posthog";

export const castVotes = onlyUser
	.schema(
		z.object({
			round: z.number(),
			votes: z.array(z.object({ proposal: z.number(), count: z.number() })),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const round = await db.primary.query.rounds.findFirst({
			where: eq(rounds.id, parsedInput.round),
			with: {
				votes: {
					where: eq(votes.user, ctx.user.id),
				},
				proposals: {
					where: eq(proposals.user, ctx.user.id),
				},
				actions: true,
				community: true,
			},
		});

		if (!round) {
			throw new Error("Round not found");
		}

		const lilnounVotes =
			round.community?.handle === "lilnouns" && ctx.user.wallets.length > 0
				? (Number(
					(
						await db.pgpool.query.snapshots.findFirst({
							where: and(
								eq(snapshots.type, "lilnouns-open-round"),
								sql`${snapshots.tag} LIKE ANY(ARRAY[${sql.join(
									ctx.user.wallets.map(
										(w) => sql`${w.address.toLowerCase()} || ':%'`,
									),
									", ",
								)}])`,
							),
						})
					)?.tag?.split(":")[1],
				) ?? 0)
				: 0;

		const percentile = ctx.user.nexus.leaderboards.find(
			(leaderboard) => leaderboard.community === round.community.id,
		)?.percentile ?? 1;

		const allocatedVotes =
			round.community.handle === "lilnouns" ? lilnounVotes : percentile <= 0.15 ? 10 : percentile <= 0.3 ? 5 : percentile <= 0.5 ? 3 : 1;



		const actions = await Promise.all(
			round.actions
				.filter((action) => action.type === "voting")
				.map(async (actionState) => {
					const action = getAction({
						action: actionState.action,
					});

					if (!action) {
						throw new Error("Action not found");
					}

					return {
						...actionState,
						completed: await action.check({
							user: ctx.user,
							inputs: actionState.inputs,
						}),
					};
				}),
		);

		if (!actions.every((action) => action.completed)) {
			throw new Error("Voting prerequisites not met");
		}

		const now = new Date();
		const votingStart = new Date(round.votingStart);
		const roundEnd = new Date(round.end);

		if (now < votingStart) {
			throw new Error("Voting has not started yet");
		}

		if (now > roundEnd) {
			throw new Error("Round has ended");
		}

		let votesUsed = round.votes.reduce((votes, vote) => votes + vote.count, 0);
		let newUserXP = 0;

		await db.primary.transaction(async (tx) => {
			for (const vote of parsedInput.votes) {
				if (vote.count === 0) continue;

				const proposal = await tx.query.proposals.findFirst({
					where: eq(proposals.id, vote.proposal),
				});

				if (!proposal) {
					throw new Error("Proposal not found");
				}

				if (proposal.user === ctx.user.id) {
					throw new Error("You cannot vote on your own proposal");
				}

				if (proposal.round !== parsedInput.round) {
					throw new Error("You can only vote on proposals in the same round");
				}

				if (votesUsed + vote.count > (round.community.handle === "lilnouns" ? 5 : allocatedVotes)) {
					throw new Error("You have used all your votes");
				}

				votesUsed += vote.count;

				// Insert the vote
				const returnedVote = await tx
					.insert(votes)
					.values({
						user: ctx.user.id,
						proposal: vote.proposal,
						round: round.id,
						count: vote.count,
						timestamp: now,
					})
					.returning({ id: votes.id });

				// Award 50 xp per vote to the voter
				const voterAmount = 50 * vote.count;

				await tx.insert(xp).values({
					user: ctx.user.id,
					amount: voterAmount,
					timestamp: now,
					vote: returnedVote[0].id,
					community: round.community.id,
				});



				const [updatePass] = await tx
					.insert(leaderboards)
					.values({
						user: ctx.user.id,
						xp: voterAmount,
						community: round.community.id,
					})
					.onConflictDoUpdate({
						target: [leaderboards.user, leaderboards.community],
						set: {
							xp: sql`${leaderboards.xp} + ${voterAmount}`,
						},
					}).returning({
						xp: leaderboards.xp,
					});

				newUserXP = updatePass.xp;


				// Award 5 xp per vote to the proposer
				const proposerAmount = 5 * vote.count;

				await tx.insert(xp).values({
					user: proposal.user,
					amount: proposerAmount,
					timestamp: now,
					vote: returnedVote[0].id,
					community: round.community.id,
				});

				await tx
					.insert(leaderboards)
					.values({
						user: proposal.user,
						xp: proposerAmount,
						community: round.community.id,
					})
					.onConflictDoUpdate({
						target: [leaderboards.user, leaderboards.community],
						set: {
							xp: sql`${leaderboards.xp} + ${proposerAmount}`,
						},
					})
			}
		});

		for (const vote of parsedInput.votes) {
			posthogClient.capture({
				event: "cast-votes",
				distinctId: ctx.user.id,
				properties: {
					round: round.id,
					proposal: vote.proposal,
					community: round.community.id,
					amount: vote.count,
				},
			});
		}

		revalidatePath(`/rounds/${round.handle}`);

		return {
			earnedXP: 50 * votesUsed,
			totalXP: newUserXP,
		};
	});
