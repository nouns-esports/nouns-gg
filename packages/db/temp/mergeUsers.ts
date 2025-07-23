// import { privyClient } from "~/apps/website/server/clients/privy";
// import { db } from ".";
// import { eq, sql } from "drizzle-orm";
// import {
// 	accounts,
// 	bets,
// 	carts,
// 	checkins,
// 	communityAdmins,
// 	gold,
// 	leaderboards,
// 	nexus,
// 	orders,
// 	proposals,
// 	purchasedVotes,
// 	questCompletions,
// 	raffleEntries,
// 	votes,
// 	xp,
// } from "./schema/public";

// const fromPrivyUser = await privyClient.getUserById("");
// const toPrivyUser = await privyClient.getUserById("");

// const fromUser = await db.primary.query.nexus.findFirst({
// 	where: eq(nexus.id, fromPrivyUser.id),
// 	with: {
// 		votes: true,
// 		bets: true,
// 		gold: true,
// 		xp: true,
// 		proposals: true,
// 		leaderboards: true,
// 		// accounts: true,
// 		purchasedVotes: true,
// 		carts: true,
// 		questCompletions: true,
// 		orders: true,
// 		raffleEntries: true,
// 		checkins: true,
// 		admins: true,
// 		attendees: true,
// 		snapshots: true,
// 	},
// });

// const toUser = await db.primary.query.nexus.findFirst({
// 	where: eq(nexus.id, toPrivyUser.id),
// 	with: {
// 		votes: true,
// 		bets: true,
// 		gold: true,
// 		xp: true,
// 		proposals: true,
// 		leaderboards: true,
// 		// accounts: true,
// 		purchasedVotes: true,
// 		carts: true,
// 		questCompletions: true,
// 		orders: true,
// 		raffleEntries: true,
// 		checkins: true,
// 		admins: true,
// 		attendees: true,
// 		snapshots: true,
// 	},
// });

// if (!fromUser) {
// 	throw new Error("From user not found");
// }

// if (!toUser) {
// 	throw new Error("To user not found");
// }

// await db.primary.transaction(async (tx) => {
// 	for (const vote of fromUser.votes) {
// 		const toUserVote = toUser.votes.find((v) => v.proposal === vote.proposal);

// 		// If toUser already has a vote, add the count to the existing vote and delete the old vote
// 		if (toUserVote) {
// 			await tx
// 				.update(votes)
// 				.set({
// 					count: sql`${votes.count} + ${vote.count}`,
// 				})
// 				.where(eq(votes.id, toUserVote.id));

// 			await tx.delete(votes).where(eq(votes.id, vote.id));
// 		}

// 		// If toUser doesn't have a vote, transfer ownership of the vote to the toUser
// 		else {
// 			await tx
// 				.update(votes)
// 				.set({
// 					user: toUser.id,
// 				})
// 				.where(eq(votes.id, vote.id));
// 		}
// 	}

// 	await tx
// 		.update(bets)
// 		.set({
// 			user: toUser.id,
// 		})
// 		.where(eq(bets.user, fromUser.id));

// 	await tx
// 		.update(gold)
// 		.set({
// 			to: toUser.id,
// 		})
// 		.where(eq(gold.to, fromUser.id));

// 	await tx
// 		.update(gold)
// 		.set({
// 			from: toUser.id,
// 		})
// 		.where(eq(gold.from, fromUser.id));

// 	await tx
// 		.update(xp)
// 		.set({
// 			user: toUser.id,
// 		})
// 		.where(eq(xp.user, fromUser.id));

// 	await tx
// 		.update(proposals)
// 		.set({
// 			user: toUser.id,
// 		})
// 		.where(eq(proposals.user, fromUser.id));

// 	for (const fromPass of fromUser.leaderboards) {
// 		await tx
// 			.insert(leaderboards)
// 			.values({
// 				xp: fromPass.xp,
// 				points: fromPass.points,
// 				user: toUser.id,
// 				community: fromPass.community,
// 			})
// 			.onConflictDoUpdate({
// 				target: [leaderboards.user, leaderboards.community],
// 				set: {
// 					xp: sql`${leaderboards.xp} + ${fromPass.xp}`,
// 					points: sql`${leaderboards.points} + ${fromPass.points}`,
// 				},
// 			});

// 		await tx.delete(leaderboards).where(eq(leaderboards.id, fromPass.id));
// 	}

// 	await tx
// 		.update(purchasedVotes)
// 		.set({
// 			user: toUser.id,
// 		})
// 		.where(eq(purchasedVotes.user, fromUser.id));

// 	await tx.delete(carts).where(eq(carts.user, fromUser.id));

// 	await tx
// 		.update(questCompletions)
// 		.set({
// 			user: toUser.id,
// 		})
// 		.where(eq(questCompletions.user, fromUser.id));

// 	await tx
// 		.update(orders)
// 		.set({
// 			user: toUser.id,
// 		})
// 		.where(eq(orders.user, fromUser.id));

// 	await tx
// 		.update(raffleEntries)
// 		.set({
// 			user: toUser.id,
// 		})
// 		.where(eq(raffleEntries.user, fromUser.id));

// 	for (const fromCheckin of fromUser.checkins) {
// 		const toCheckin = toUser.checkins.find(
// 			(c) => c.checkpoint === fromCheckin.checkpoint,
// 		);

// 		if (toCheckin) {
// 			await tx.delete(checkins).where(eq(checkins.id, fromCheckin.id));
// 			continue;
// 		}

// 		await tx
// 			.update(checkins)
// 			.set({
// 				user: toUser.id,
// 			})
// 			.where(eq(checkins.id, fromCheckin.id));
// 	}

// 	for (const fromAdmin of fromUser.admins) {
// 		const toAdmin = toUser.admins.find(
// 			(a) => a.community === fromAdmin.community,
// 		);

// 		if (toAdmin) {
// 			await tx.delete(communityAdmins).where(eq(communityAdmins.id, fromAdmin.id));
// 			continue;
// 		}

// 		await tx.insert(communityAdmins).values({
// 			user: toUser.id,
// 			community: fromAdmin.community,
// 			owner: fromAdmin.owner,
// 		});
// 	}
// });
