import { db } from "~/packages/db";
import { linkedWallets, nexus } from "~/packages/db/schema/public";
import { privyClient } from "../clients/privy";
import { createJob } from "../createJob";

export const privySync = createJob({
	name: "Privy Sync",
	cron: "0 0 * * *", // Every day at midnight
	execute: async () => {
		const users = await privyClient.getUsers();

		await db.primary.transaction(async (tx) => {
			for (const user of users) {
				await tx
					.insert(nexus)
					.values({
						id: user.id,
						twitter: user.twitter?.username,
						discord: user.discord?.username?.split("#")[0],
						fid: user.farcaster?.fid,
					})
					.onConflictDoUpdate({
						target: [nexus.id],
						set: {
							twitter: user.twitter?.username,
							discord: user.discord?.username?.split("#")[0],
							fid: user.farcaster?.fid,
						},
					});

				for (const linkedAccount of user.linkedAccounts) {
					if (linkedAccount.type === "wallet") {
						if (linkedAccount.walletClientType === "privy") {
							continue;
						}

						await tx
							.insert(linkedWallets)
							.values({
								address: linkedAccount.address,
								user: user.id,
								client: linkedAccount.walletClientType as any,
							})
							.onConflictDoNothing();
					}
				}
			}
		});
	},
});
