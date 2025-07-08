"use server";

import { onlyUser } from ".";
import { privyClient } from "../clients/privy";
import { nexus, proposals, votes } from "~/packages/db/schema/public";
import { desc, eq } from "drizzle-orm";
import { db } from "~/packages/db";

export const deleteUser = onlyUser.action(async ({ ctx }) => {
	if (ctx.user.nexus.deletedAt !== null) {
		return true;
	}

	try {
		await db.primary.transaction(async (tx) => {
			const now = new Date();

			await privyClient.deleteUser(ctx.user.privyId);
			await db.primary
				.update(nexus)
				.set({
					name: "Deleted User",
					image:
						"https://ipfs.nouns.gg/ipfs/bafkreifznv3isngocvxcddhmtercz7qbs5vvu5adrdgvqjucl36ipfyh3m",
					deletedAt: now,
				})
				.where(eq(nexus.id, ctx.user.id));

			const userVotes = await tx.query.votes.findMany({
				orderBy: desc(votes.timestamp),
				where: eq(votes.user, ctx.user.id),
				with: {
					round: true,
				},
			});

			for (const vote of userVotes) {
				if (vote.round.end > now) {
					await tx.delete(votes).where(eq(votes.id, vote.id));
				}
			}

			const userProposals = await tx.query.proposals.findMany({
				where: eq(proposals.user, ctx.user.id),
				with: {
					round: true,
					votes: true,
				},
			});

			for (const proposal of userProposals) {
				if (proposal.round.end > now) {
					await tx
						.update(proposals)
						.set({
							deletedAt: now,
						})
						.where(eq(proposals.id, proposal.id));

					for (const vote of proposal.votes) {
						await tx.delete(votes).where(eq(votes.id, vote.id));
					}
				}
			}
		});

		return true;
	} catch (e) {
		console.error("Error deleting user", e);
	}

	return false;
});
