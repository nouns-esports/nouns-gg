import { db } from "~/packages/db";
import { nexus, xp } from "~/packages/db/schema/public";
import { privyClient } from "../clients/privy";
import { createJob } from "../createJob";
import { eq, sql } from "drizzle-orm";
import { neynarClient } from "../clients/neynar";

export const farcasterXP = createJob({
	name: "Farcaster XP",
	cron: "0 0 * * *", // Every day at midnight
	execute: async () => {
		const users = await privyClient.getUsers();

		const totals: Record<
			number,
			{
				likes: number;
				recasts: number;
			}
		> = {};

		let cursor: string | undefined | null = undefined;

		const now = new Date();
		const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // yesterday
		let latestTimestamp = now;

		while (latestTimestamp > cutoff && cursor !== null) {
			const casts = await neynarClient.fetchFeedByChannelIds(
				["nouns-esports"],
				{
					limit: 10,
					membersOnly: false,
					cursor,
				},
			);

			cursor = casts.next.cursor;

			for (const cast of casts.casts) {
				const timestamp = new Date(cast.timestamp);
				latestTimestamp = timestamp;
				if (timestamp < cutoff) continue;

				if (
					cast.reactions.likes.length === 0 &&
					cast.reactions.recasts.length === 0
				) {
					continue;
				}

				if (!totals[cast.author.fid]) {
					totals[cast.author.fid] = {
						likes: 0,
						recasts: 0,
					};
				}

				if (cast.reactions.likes.length > 0) {
					totals[cast.author.fid].likes += cast.reactions.likes.length;
				}

				if (cast.reactions.recasts.length > 0) {
					totals[cast.author.fid].recasts += cast.reactions.recasts.length;
				}
			}

			console.log(`Processed ${casts.casts.length} casts`);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		await db.transaction(async (tx) => {
			for (const [caster, { likes, recasts }] of Object.entries(totals)) {
				const likesXP = likes * 25;
				const recastsXP = recasts * 75;
				const user = users.find(
					(user) => user.farcaster?.fid === Number(caster),
				);

				if (!user) continue;

				await tx.insert(xp).values({
					user: user.id,
					amount: likesXP + recastsXP,
					timestamp: now,
				});

				await tx
					.update(nexus)
					.set({
						xp: sql`${nexus.xp} + ${likesXP + recastsXP}`,
					})
					.where(eq(nexus.id, user.id));
			}
		});
	},
});
