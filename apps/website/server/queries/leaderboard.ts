import { db } from "~/packages/db";
import { desc, eq, sql } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";
import { nexus } from "~/packages/db/schema/public";

export const getLeaderboard = cache(
	async () => {
		return db.pgpool.query.nexus.findMany({
			orderBy: [desc(nexus.xp)],
			limit: 100,
		});
	},
	["getLeaderboard"],
	{
		tags: ["getLeaderboard"],
		revalidate: 60 * 24,
	},
);

export const getRank = cache(
	async (input: { user: string }) => {
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
	},
	["getRank"],
	{
		tags: ["getRank"],
		revalidate: 60 * 24,
	},
);
