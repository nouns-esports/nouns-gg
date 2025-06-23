import { eq, sql } from "drizzle-orm";
import { db } from ".";
import { gold, leaderboards, nexus } from "./schema/public";

const users = {
	"2e043760-6fa7-4c41-89da-7bcf6b39ace1": 2000,
};

const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902";

await db.primary.transaction(async (tx) => {
	for (const [user, amount] of Object.entries(users)) {
		const userRecord = await tx.query.nexus.findFirst({
			where: eq(nexus.id, user),
		});

		if (!userRecord) {
			throw new Error(`User ${user} not found`);
		}

		await tx.insert(gold).values({
			amount: amount,
			from: null,
			to: user,
			community: nounsgg,
		});

		await tx
			.insert(leaderboards)
			.values({
				user,
				points: amount,
				community: nounsgg,
			})
			.onConflictDoUpdate({
				target: [leaderboards.user, leaderboards.community],
				set: {
					points: sql`${leaderboards.points} + ${amount}`,
				},
			});
	}
});
