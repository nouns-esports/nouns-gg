"use server";

import {
	votes,
	proposals,
	rounds,
	xp,
	nexus,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { onlyUser } from ".";
import { getAction } from "../actions";

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
			},
		});

		if (!round) {
			throw new Error("Round not found");
		}

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

				if (votesUsed + vote.count > ctx.user.votes) {
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
				await tx.insert(xp).values({
					user: ctx.user.id,
					amount: 50 * vote.count,
					timestamp: now,
					vote: returnedVote[0].id,
					community: round.community,
				});

				await tx
					.update(nexus)
					.set({
						xp: sql`${nexus.xp} + ${50 * vote.count}`,
					})
					.where(eq(nexus.id, ctx.user.id));

				// Award 5 xp per vote to the proposer
				await tx.insert(xp).values({
					user: proposal.user,
					amount: 5 * vote.count,
					timestamp: now,
					vote: returnedVote[0].id,
					community: round.community,
				});

				const [updateNexus] = await tx
					.update(nexus)
					.set({
						xp: sql`${nexus.xp} + ${5 * vote.count}`,
					})
					.where(eq(nexus.id, proposal.user))
					.returning({
						xp: nexus.xp,
					});

				newUserXP = updateNexus.xp;
			}
		});

		revalidatePath(`/rounds/${round.handle}`);

		return {
			earnedXP: 50 * votesUsed,
			totalXP: newUserXP,
		};
	});
