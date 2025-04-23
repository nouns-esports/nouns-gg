import { db } from "~/packages/db";
import { desc, eq, sql } from "drizzle-orm";
import { nexus } from "~/packages/db/schema/public";

export async function getLeaderboard() {
	return db.pgpool.query.nexus.findMany({
		orderBy: [desc(nexus.xp)],
		limit: 100,
		with: {
			profile: true,
		},
	});
}

export async function getRank(input: { user: string }) {
	const [{ rank }] = await db.pgpool
		.select({
			rank: sql<number>`1 + COUNT(*)`,
		})
		.from(nexus)
		.where(
			sql`${nexus.xp} > (
					SELECT xp
					FROM nexus
					WHERE id = ${input.user}
				)`,
		);

	return rank;
}
