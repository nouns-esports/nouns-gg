import { privyClient } from "~/apps/automations/clients/privy";
import { db } from "..";
import { accounts } from "../schema/public";

const privyUsers = await privyClient.getUsers();
const users = await db.primary.query.nexus.findMany();

await db.primary.transaction(async (tx) => {
	let count = 0;
	for (const user of privyUsers) {
		count++;
		console.log(`Processing user ${count} of ${privyUsers.length}`);
		const nexusUser = users.find((nexusUser) => nexusUser.privyId === user.id);

		if (!nexusUser) continue;

		if (user.discord) {
			await tx
				.insert(accounts)
				.values({
					platform: "discord",
					identifier: user.discord.subject,
					user: nexusUser.id,
				})
				.onConflictDoUpdate({
					target: [accounts.platform, accounts.identifier],
					set: {
						user: nexusUser.id,
					},
				});
		}

		if (user.twitter) {
			await tx
				.insert(accounts)
				.values({
					platform: "twitter",
					identifier: user.twitter.subject,
					user: nexusUser.id,
				})
				.onConflictDoUpdate({
					target: [accounts.platform, accounts.identifier],
					set: {
						user: nexusUser.id,
					},
				});
		}

		if (user.farcaster) {
			await tx
				.insert(accounts)
				.values({
					platform: "farcaster",
					identifier: user.farcaster.fid.toString(),
					user: nexusUser.id,
				})
				.onConflictDoUpdate({
					target: [accounts.platform, accounts.identifier],
					set: {
						user: nexusUser.id,
					},
				});
		}
	}
});
