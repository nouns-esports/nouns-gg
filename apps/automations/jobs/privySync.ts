import { db } from "~/packages/db";
import { nexus } from "~/packages/db/schema/public";
import { privyClient } from "../clients/privy";
import { createJob } from "../createJob";
import { eq } from "drizzle-orm";

export const privySync = createJob({
	name: "Privy Sync",
	cron: "0 0 * * *", // Every day at midnight
	execute: async () => {
		const users = await privyClient.getUsers();

		await db.primary.transaction(async (tx) => {
			for (const user of users) {
				await tx
					.update(nexus)
					.set({
						discord: user.discord?.username
							? user.discord.username.split("#")[0]
							: undefined,
						username: user.farcaster?.username
							? user.farcaster.username
							: undefined,
						fid: user.farcaster?.fid ? user.farcaster.fid : undefined,
						twitter: user.twitter?.username ? user.twitter.username : undefined,
					})
					.where(eq(nexus.id, user.id));
			}
		});
	},
});
