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
import { onlyRanked } from ".";
import {
	erc721Balances,
	lilnounDelegates,
	nounDelegates,
} from "~/packages/db/schema/indexer";

export const castVotes = onlyRanked
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
				// voterCredential: {
				// 	with: {
				// 		erc721Balances: {
				// 			limit: 1,
				// 			where: inArray(
				// 				erc721Balances.account,
				// 				ctx.user.wallets.map((w) => w.address),
				// 			),
				// 		},
				// 	},
				// },
			},
		});

		if (!round) {
			throw new Error("Round not found");
		}

		if (
			round.minVoterRank &&
			ctx.user.nexus?.rank &&
			ctx.user.nexus.rank.place < round.minVoterRank.place
		) {
			throw new Error("You are not eligible to vote in this round");
		}

		// if (round.voterCredential) {
		// 	if (!round.voterCredential.address) {
		// 		throw new Error("Credentials require an onchain address");
		// 	}

		// 	if (round.voterCredential.erc721Balances.length === 0) {
		// 		if (round.voterCredential.address === "0xNOUNS") {
		// 			const delegatee = await db.primary.query.nounDelegates.findFirst({
		// 				where: inArray(
		// 					nounDelegates.to,
		// 					ctx.user.wallets.map((w) => w.address),
		// 				),
		// 			});

		// 			if (!delegatee) {
		// 				throw new Error("You have delegated your vote to another user");
		// 			}
		// 		}

		// 		if (round.voterCredential.address === "0xLILNOUNS") {
		// 			const delegatee = await db.primary.query.lilnounDelegates.findFirst({
		// 				where: inArray(
		// 					lilnounDelegates.to,
		// 					ctx.user.wallets.map((w) => w.address),
		// 				),
		// 			});
		// 		}
		// 	}
		// }

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

				if (votesUsed + vote.count > ctx.user.nexus.rank.votes) {
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
