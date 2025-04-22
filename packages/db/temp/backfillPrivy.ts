import { privyClient } from "~/apps/automations/clients/privy";
import { db } from "..";
import {
	linkedDiscords,
	linkedFarcasters,
	linkedTwitters,
	linkedWallets,
	nexus,
} from "../schema/public";

const users = await privyClient.getUsers();

await db.primary.transaction(async (tx) => {
	for (const user of users) {
		await tx
			.insert(nexus)
			.values({
				id: user.id,
			})
			.onConflictDoNothing();

		if (user.discord?.username) {
			await tx
				.insert(linkedDiscords)
				.values({
					username: user.discord.username,
					user: user.id,
				})
				.onConflictDoNothing();
		}

		if (user.farcaster) {
			await tx
				.insert(linkedFarcasters)
				.values({
					fid: user.farcaster.fid,
					user: user.id,
				})
				.onConflictDoNothing();
		}

		if (user.twitter?.username) {
			await tx
				.insert(linkedTwitters)
				.values({
					username: user.twitter.username,
					user: user.id,
				})
				.onConflictDoNothing();
		}

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
						chains: linkedAccount.chainId
							? [parseInt(linkedAccount.chainId)]
							: [],
					})
					.onConflictDoNothing();
			}
		}
	}
});
