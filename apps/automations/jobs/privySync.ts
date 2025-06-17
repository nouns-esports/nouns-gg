// import { db } from "~/packages/db";
// import { nexus } from "~/packages/db/schema/public";
// import { privyClient } from "../clients/privy";
// import { createJob } from "../createJob";

// export const privySync = createJob({
// 	name: "Privy Sync",
// 	cron: "0 0 * * *", // Every day at midnight
// 	execute: async () => {
// 		const users = await privyClient.getUsers();

// 		await db.primary.transaction(async (tx) => {
// 			for (const user of users) {
// 				await tx
// 					.insert(nexus)
// 					.values({
// 						id: user.id,
// 						twitter: user.twitter?.username,
// 						discord: user.discord?.username?.split("#")[0],
// 						fid: user.farcaster?.fid,
// 					})
// 					.onConflictDoUpdate({
// 						target: [nexus.id],
// 						set: {
// 							twitter: user.twitter?.username ?? null,
// 							discord: user.discord?.username?.split("#")[0] ?? null,
// 							fid: user.farcaster?.fid ?? null,
// 						},
// 					});
// 			}
// 		});
// 	},
// });
