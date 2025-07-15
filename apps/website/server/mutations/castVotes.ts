"use server";

import {
	votes,
	proposals,
	rounds,
	xp,
	nexus,
	leaderboards,
	snapshots,
	nounsvitationalVotes,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq, ilike, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { onlyUser } from ".";
import { getAction } from "../actions";
import { posthogClient } from "../clients/posthog";

export const castVotes = onlyUser
	.schema(
		z.object({
			round: z.string(),
			votes: z.array(z.object({ proposal: z.string(), count: z.number() })),
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
				community: {
					with: {
						admins: true,
						connections: true,
					},
				},
			},
		});

		if (!round) {
			throw new Error("Round not found");
		}

		let lilnounVotes = 0;
		for (const wallet of ctx.user.wallets) {
			const snapshot = await db.primary.query.snapshots.findFirst({
				where: and(
					eq(snapshots.type, "lilnouns-software"),
					ilike(snapshots.tag, `${wallet.address.toLowerCase()}:%`),
				),
			});

			if (snapshot) {
				lilnounVotes = lilnounVotes + Number(snapshot.tag?.split(":")[1] ?? 0);
			}
		}

		const percentile =
			ctx.user.nexus.leaderboards.find(
				(leaderboard) => leaderboard.community === round.community.id,
			)?.percentile ?? 1;

		let allocatedVotes =
			round.community.handle === "lilnouns"
				? lilnounVotes
				: percentile <= 0.1
					? 10
					: percentile <= 0.25
						? 5
						: percentile <= 0.4
							? 3
							: 1;

		if (round.handle === "japan-round-1") {
			const japanExtraVotes =
				await db.primary.query.nounsvitationalVotes.findFirst({
					where: eq(nounsvitationalVotes.user, ctx.user.id),
				});

			if (japanExtraVotes) {
				allocatedVotes = allocatedVotes + japanExtraVotes.count;
			}
		}

		const actions = round.actions.filter((action) => action.type === "voting");

		for (const actionState of actions) {
			const action = getAction({
				action: actionState.action,
				platform: actionState.platform ?? "dash",
			});

			if (!action) {
				throw new Error("Action not found");
			}

			const completed = await action.check({
				user: ctx.user.nexus,
				input: actionState.input,
				community: round.community,
			});

			if (actionState.required && !completed) {
				throw new Error("Voting prerequisites not met");
			}

			allocatedVotes = allocatedVotes + actionState.votes;
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

				if (votesUsed + vote.count > allocatedVotes) {
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
					})
					.returning({
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
					});
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
