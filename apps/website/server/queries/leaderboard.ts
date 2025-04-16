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
		revalidate: 60 * 60 * 24,
	},
);

export const getRank = cache(
	async (input: { user: string }) => {
		return db.pgpool
			.select({
				rank: sql<number>`ROW_NUMBER() OVER (ORDER BY xp DESC)`,
			})
			.from(nexus)
			.where(eq(nexus.id, input.user));
	},
	["getRank"],
	{
		tags: ["getRank"],
		revalidate: 60 * 60 * 24,
	},
);
