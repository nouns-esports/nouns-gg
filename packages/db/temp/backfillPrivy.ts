import { privyClient } from "~/apps/automations/clients/privy";
import { db } from "..";
import { nexus } from "../schema/public";

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
					twitter: user.twitter?.username ?? null,
					discord: user.discord?.username?.split("#")[0] ?? null,
					fid: user.farcaster?.fid ?? null,
				},
			});
	}
});
