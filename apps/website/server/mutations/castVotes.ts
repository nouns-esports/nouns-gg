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
import { nullable, z } from "zod";
import { onlyUser } from ".";
import { getAction } from "../actions";
import { posthogClient } from "../clients/posthog";
import { viemClient } from "../clients/viem";
import { parseAbiItem } from "viem";
import { env } from "~/env";

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

		let allocatedVotes = 0;

		if (round.votingConfig?.mode === "leaderboard") {
			const percentile =
				ctx.user.nexus.leaderboards.find(
					(leaderboard) => leaderboard.community.id === round.community.id,
				)?.percentile ?? 1;

			if (percentile <= 0.02) allocatedVotes += 10;
			else if (percentile <= 0.05) allocatedVotes += 5;
			else if (percentile <= 0.15) allocatedVotes += 3;
			else allocatedVotes += 1;
		}

		if (round.votingConfig?.mode === "fixed") {
			allocatedVotes += round.votingConfig.count;
		}

		if (round.votingConfig?.mode === "discord-roles") {
			const account = ctx.user.nexus.accounts.find(
				(account) => account.platform === "discord",
			);

			if (account) {
				const serverRoles: Record<string, Record<string, number>> = {};

				for (const role of round.votingConfig.roles) {
					serverRoles[role.server] = {
						...(serverRoles[role.server] ?? {}),
						[role.id]: role.count,
					};
				}

				for (const [server, roles] of Object.entries(serverRoles)) {
					const memberResponse = await fetch(
						`https://discord.com/api/guilds/${server}/members/${account.identifier}`,
						{
							headers: {
								Authorization: `Bot ${env.DASH_DISCORD_TOKEN}`,
								"Content-Type": "application/json",
							},
						},
					);

					if (memberResponse.ok) {
						const data = (await memberResponse.json()) as { roles: string[] };

						for (const role of data.roles) {
							const requiredRole = roles[role];

							if (requiredRole) {
								allocatedVotes += requiredRole;
							}
						}
					}
				}
			}
		}

		if (round.votingConfig?.mode === "token-weight") {
			for (const token of round.votingConfig.tokens) {
				for (const wallet of ctx.user.wallets) {
					if (token.type === "native") {
						const client = viemClient(token.chain);

						const balance = await client.getBalance({
							address: wallet.address as `0x${string}`,
							blockNumber: token.block ? BigInt(token.block) : undefined,
						});

						const balanceWithDecimals =
							Number(balance) / 10 ** client.chain.nativeCurrency.decimals;

						if (balanceWithDecimals < token.minBalance) continue;

						allocatedVotes += Math.floor(
							balanceWithDecimals / token.conversionRate,
						);
					}

					if (token.type === "erc20") {
						const client = viemClient(token.chain);

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
					}

					if (token.type === "erc721") {
						const client = viemClient(token.chain);
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
					}

					if (token.type === "erc1155") {
						const client = viemClient(token.chain);
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

					if (token.type === "nouns") {
						const client = viemClient("mainnet");

						const votes = await client.readContract({
							address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
							abi: [
								parseAbiItem(
									"function getCurrentVotes(address) view returns (uint96)",
								),
							],
							functionName: "getCurrentVotes",
							blockNumber: token.block ? BigInt(token.block) : undefined,
							args: [wallet.address as `0x${string}`],
						});

						if (Number(votes) < token.minBalance) continue;

						allocatedVotes += Math.floor(Number(votes) / token.conversionRate);
					}

					if (token.type === "lilnouns") {
						const client = viemClient("mainnet");

						const votes = await client.readContract({
							address: "0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b",
							abi: [
								parseAbiItem(
									"function getCurrentVotes(address) view returns (uint96)",
								),
							],
							functionName: "getCurrentVotes",
							blockNumber: token.block ? BigInt(token.block) : undefined,
							args: [wallet.address as `0x${string}`],
						});

						if (Number(votes) < token.minBalance) continue;

						allocatedVotes += Math.floor(Number(votes) / token.conversionRate);
					}

					if (token.type === "gnars") {
						const client = viemClient("base");

						const votes = await client.readContract({
							address: "0x880Fb3Cf5c6Cc2d7DFC13a993E839a9411200C17",
							abi: [
								parseAbiItem(
									"function getVotes(address) view returns (uint256)",
								),
							],
							functionName: "getVotes",
							blockNumber: token.block ? BigInt(token.block) : undefined,
							args: [wallet.address as `0x${string}`],
						});

						if (Number(votes) < token.minBalance) continue;

						allocatedVotes += Math.floor(Number(votes) / token.conversionRate);
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

			if (completed) {
				allocatedVotes += actionState.votes;
			}
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

			const votesUsedTotal = priorVotes.reduce((n, v) => n + v.count, 0);

			const boughtVotes = await tx
				.select()
				.from(purchasedVotes)
				.where(
					and(
						eq(purchasedVotes.user, ctx.user.id),
						eq(purchasedVotes.round, round.id),
					),
				)
				.for("update");

			let purchasedRemaining = boughtVotes.reduce(
				(n, v) => n + v.count - v.used,
				0,
			);

			const purchasedUsed = boughtVotes.reduce((n, v) => n + v.used, 0);

			const dynamicUsed = Math.min(
				votesUsedTotal - purchasedUsed,
				allocatedVotes,
			);

			let dynamicRemaining = allocatedVotes - dynamicUsed;

			for (const vote of Object.values(ballot)) {
				if (vote.count > dynamicRemaining + purchasedRemaining) {
					throw new Error("You have used all your votes");
				}

				const useFromDynamic = Math.min(vote.count, dynamicRemaining);
				dynamicRemaining -= useFromDynamic;
				let toAllocate = vote.count - useFromDynamic;

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

				if (toAllocate > 0) {
					for (const pv of boughtVotes) {
						const avail = pv.count - pv.used;
						if (avail <= 0) continue;
						const use = Math.min(avail, toAllocate);
						await tx
							.update(purchasedVotes)
							.set({ used: pv.used + use })
							.where(eq(purchasedVotes.id, pv.id));
						pv.used += use;
						purchasedRemaining -= use;
						toAllocate -= use;
						if (toAllocate === 0) break;
					}
				}

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
