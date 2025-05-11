import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "..";
import { gold, nexus } from "../schema/public";

const users = {
	"did:privy:clyqngc880bvr7lidaed43ntn": 1750,
	"did:privy:cm19rapl6028pf8xggalbw7rd": 1000,
	"did:privy:clyrjox0p0dd4rwe1lilqaf7v": 1000,
	"did:privy:cm5oipddl03yvnvfnf55ztp1p": 1000,
	"did:privy:clx9goa170bm3wjgyx8ktxxor": 1000,
	"did:privy:cm0u49y4s036i98yrh8nsko5o": 1000,
};

await db.primary.transaction(async (tx) => {
	const now = new Date();
	for (const [user, amount] of Object.entries(users)) {
		await tx.insert(gold).values({
			amount: amount.toString(),
			from: null,
			timestamp: now,
			to: user,
		});

		await tx
			.update(nexus)
			.set({
				gold: sql`${nexus.gold} + ${amount}`,
			})
			.where(eq(nexus.id, user));
	}
});
