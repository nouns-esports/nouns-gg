"use server";

import {
	votes,
	proposals,
	rounds,
	xp,
	nexus,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { onlyUser } from ".";

import { getUserHasCredential } from "../queries/users";
import { level } from "@/utils/level";
import { nounDelegates } from "~/packages/db/schema/indexer";

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
				minVoterRank: true,
			},
		});

		if (!round) {
			throw new Error("Round not found");
		}

		let nounDelegate = false;

		if (round.minVoterRank) {
			const { currentLevel } = level(ctx.user.nexus?.xp ?? 0);

			if (currentLevel < 15) {
				if (round.handle === "nouns-traits" || round.handle === "nouns-heads") {
					const isDelegate = await db.primary.query.nounDelegates.findFirst({
						where: inArray(
							nounDelegates.to,
							ctx.user.wallets.map((w) => w.address as `0x${string}`),
						),
					});

					if (!isDelegate) {
						throw new Error("You are not eligible to vote in this round");
					}

					nounDelegate = true;
				} else throw new Error("You are not eligible to vote in this round");
			}
		}

		if (round.voterCredential) {
			const hasCredential = await getUserHasCredential({
				token: round.voterCredential,
				wallets: ctx.user.wallets.map((w) => w.address as `0x${string}`),
			});

			if (!hasCredential) {
				throw new Error("You do not have a valid credential");
			}
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

				if (!ctx.user.nexus?.rank) {
					throw new Error("Enter the Nexus to vote");
				}

				const { currentLevel } = level(ctx.user.nexus.xp);

				const maxVotes =
					nounDelegate || currentLevel >= 15
						? 10
						: currentLevel >= 10
							? 5
							: currentLevel >= 5
								? 3
								: 1;

				if (votesUsed + vote.count > maxVotes) {
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
