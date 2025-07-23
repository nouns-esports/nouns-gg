"use server";

import {
	votes,
	proposals,
	rounds,
	xp,
	nexus,
	leaderboards,
	snapshots,
	purchasedVotes,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { onlyUser } from ".";
import { getAction } from "../actions";
import { posthogClient } from "../clients/posthog";
import { viemClient } from "../clients/viem";
import { parseAbiItem } from "viem";

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
				proposals: {
					where: eq(proposals.user, ctx.user.id),
				},
				actions: true,
				community: {
					with: {
						admins: true,
						plugins: true,
					},
				},
				purchasedVotes: {
					where: eq(purchasedVotes.user, ctx.user.id),
				},
			},
		});

		if (!round) {
			throw new Error("Round not found");
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

		const ballot: Record<
			string,
			{ count: number; proposal: typeof proposals.$inferSelect }
		> = {};

		for (const vote of parsedInput.votes) {
			if (vote.count === 0) continue;

			const proposal = await db.primary.query.proposals.findFirst({
				where: and(
					eq(proposals.id, vote.proposal),
					eq(proposals.round, round.id),
				),
			});

			if (!proposal) {
				throw new Error("Proposal not found");
			}

			if (proposal.user === ctx.user.id) {
				throw new Error("You cannot vote on your own proposal");
			}

			ballot[vote.proposal] = {
				count: (ballot[vote.proposal]?.count ?? 0) + vote.count,
				proposal,
			};
		}

		let allocatedVotes =
			round.purchasedVotes?.reduce((votes, vote) => votes + vote.count, 0) ?? 0;

		if (round.votingConfig?.mode === "leaderboard") {
			const percentile =
				ctx.user.nexus.leaderboards.find(
					(leaderboard) => leaderboard.community.id === round.community.id,
				)?.percentile ?? 1;

			if (percentile <= 0.1) allocatedVotes += 10;
			else if (percentile <= 0.25) allocatedVotes += 5;
			else if (percentile <= 0.4) allocatedVotes += 3;
			else allocatedVotes += 1;
		}

		if (round.votingConfig?.mode === "nouns") {
			const client = viemClient("mainnet");

			for (const wallet of ctx.user.wallets) {
				const votes = await client.readContract({
					address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
					abi: [
						parseAbiItem(
							"function getCurrentVotes(address) view returns (uint96)",
						),
					],
					functionName: "getCurrentVotes",
					blockNumber: round.votingConfig.block
						? BigInt(round.votingConfig.block)
						: undefined,
					args: [wallet.address as `0x${string}`],
				});

				allocatedVotes += Number(votes);
			}
		}

		if (round.votingConfig?.mode === "lilnouns") {
			const client = viemClient("mainnet");

			for (const wallet of ctx.user.wallets) {
				const votes = await client.readContract({
					address: "0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b",
					abi: [
						parseAbiItem(
							"function getCurrentVotes(address) view returns (uint96)",
						),
					],
					functionName: "getCurrentVotes",
					blockNumber: round.votingConfig.block
						? BigInt(round.votingConfig.block)
						: undefined,
					args: [wallet.address as `0x${string}`],
				});

				allocatedVotes += Number(votes);
			}
		}

		if (round.votingConfig?.mode === "token-weight") {
			const client = viemClient("mainnet");

			for (const token of round.votingConfig.tokens) {
				for (const wallet of ctx.user.wallets) {
					if (token.type === "erc20") {
						const balance = await client.readContract({
							address: token.address as `0x${string}`,
							abi: [
								parseAbiItem(
									"function balanceOf(address owner) view returns (uint256)",
								),
							],
							functionName: "balanceOf",
							blockNumber: token.block ? BigInt(token.block) : undefined,
							args: [wallet.address as `0x${string}`],
						});

						const balanceWithDecimals = Number(balance) / 10 ** token.decimals;

						if (balanceWithDecimals < token.minBalance) continue;

						allocatedVotes += Math.floor(
							balanceWithDecimals / token.conversionRate,
						);
					} else if (token.type === "erc721") {
						const balance = await client.readContract({
							address: token.address as `0x${string}`,
							abi: [
								parseAbiItem(
									"function balanceOf(address owner) view returns (uint256)",
								),
							],
							functionName: "balanceOf",
							blockNumber: token.block ? BigInt(token.block) : undefined,
							args: [wallet.address as `0x${string}`],
						});

						if (Number(balance) < token.minBalance) continue;

						allocatedVotes += Math.floor(
							Number(balance) / token.conversionRate,
						);
					} else if (token.type === "erc1155") {
						const balance = await client.readContract({
							address: token.address as `0x${string}`,
							abi: [
								parseAbiItem(
									"function balanceOf(address owner, uint256 id) view returns (uint256)",
								),
							],
							functionName: "balanceOf",
							blockNumber: token.block ? BigInt(token.block) : undefined,
							args: [wallet.address as `0x${string}`, BigInt(token.tokenId)],
						});

						if (Number(balance) < token.minBalance) continue;

						allocatedVotes += Math.floor(
							Number(balance) / token.conversionRate,
						);
					}
				}
			}
		}

		const actions = round.actions.filter((action) => action.type === "voting");

		for (const actionState of actions) {
			const action = getAction({
				action: actionState.action,
				plugin: actionState.plugin ?? "dash",
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

			allocatedVotes += actionState.votes;
		}

		let newUserXP = 0;
		let earnedXP = 0;

		const voteRecords: Array<typeof votes.$inferSelect> = [];

		await db.primary.transaction(async (tx) => {
			await tx.execute(sql`
				SELECT pg_advisory_xact_lock(
				  hashtext(${ctx.user.id}::text),  
				  hashtext(${round.id}::text) 
				)
			`);

			const priorVotes = await tx
				.select()
				.from(votes)
				.where(and(eq(votes.user, ctx.user.id), eq(votes.round, round.id)))
				.for("update");

			let votesUsed = priorVotes.reduce((n, v) => n + v.count, 0);

			for (const vote of Object.values(ballot)) {
				if (votesUsed + vote.count > allocatedVotes) {
					throw new Error("You have used all your votes");
				}

				votesUsed += vote.count;

				// Insert the vote
				const [returnedVote] = await tx
					.insert(votes)
					.values({
						user: ctx.user.id,
						proposal: vote.proposal.id,
						round: round.id,
						count: vote.count,
					})

					.returning();

				voteRecords.push(returnedVote);

				if (round.xp && round.xp.castingVotes > 0 && priorVotes.length === 0) {
					await tx.insert(xp).values({
						user: ctx.user.id,
						amount: round.xp.castingVotes,
						round: round.id,
						community: round.community.id,
						for: "CASTING_VOTE",
					});

					const [updatePass] = await tx
						.insert(leaderboards)
						.values({
							user: ctx.user.id,
							xp: round.xp.castingVotes,
							community: round.community.id,
						})
						.onConflictDoUpdate({
							target: [leaderboards.user, leaderboards.community],
							set: {
								xp: sql`${leaderboards.xp} + ${round.xp.castingVotes}`,
							},
						})
						.returning({
							xp: leaderboards.xp,
						});

					newUserXP = updatePass.xp;
					earnedXP = round.xp.castingVotes;
				}
			}

			for (const vote of Object.values(ballot)) {
				const proposerRecievedXP = !!priorVotes.find(
					(v) => v.proposal === vote.proposal.id,
				);

				if (round.xp && round.xp.receivingVotes > 0 && !proposerRecievedXP) {
					const voteRecord = voteRecords.find(
						(v) => v.proposal === vote.proposal.id,
					);

					if (!voteRecord) continue;

					await tx.insert(xp).values({
						user: vote.proposal.user,
						amount: round.xp.receivingVotes,
						round: round.id,
						proposal: vote.proposal.id,
						vote: voteRecord.id,
						community: round.community.id,
						for: "RECEIVING_VOTE",
					});

					await tx
						.insert(leaderboards)
						.values({
							user: vote.proposal.user,
							xp: round.xp.receivingVotes,
							community: round.community.id,
						})
						.onConflictDoUpdate({
							target: [leaderboards.user, leaderboards.community],
							set: {
								xp: sql`${leaderboards.xp} + ${round.xp.receivingVotes}`,
							},
						});
				}
			}
		});

		for (const vote of Object.values(ballot)) {
			posthogClient.capture({
				event: "cast-votes",
				distinctId: ctx.user.id,
				properties: {
					round: round.id,
					proposal: vote.proposal.id,
					community: round.community.id,
					amount: vote.count,
				},
			});
		}

		return {
			earnedXP,
			totalXP: newUserXP,
		};
	});
