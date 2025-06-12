import { communities } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getCommunities = cache(
	async (input?: { featured?: boolean; limit?: number }) => {
		//
		return db.pgpool.query.communities.findMany({
			where: and(input?.featured ? eq(communities.featured, true) : undefined),
			orderBy: asc(communities.name),
			limit: input?.limit,
		});
	},
	["getCommunities"],
	{ revalidate: 60 * 10 },
);

export const getCommunity = cache(
	async (input: { handle: string }) => {
		return db.pgpool.query.communities.findFirst({
			where: eq(communities.handle, input.handle),
			extras: {
				hasRounds: sql<boolean>`
					(
						SELECT COUNT(*) FROM rounds WHERE rounds.community = communities.id
					) > 0
				`.as("hasRounds"),
				hasQuests: sql<boolean>`
					(
						SELECT COUNT(*) FROM archive.quests WHERE quests.community = communities.id AND quests.active = true
					) > 0
				`.as("hasQuests"),
				hasPredictions: sql<boolean>`
					(	
						SELECT COUNT(*) FROM predictions WHERE predictions.community = communities.id
					) > 0
				`.as("hasPredictions"),
				hasEvents: sql<boolean>`
					(
						SELECT COUNT(*) FROM events WHERE events.community = communities.id
					) > 0
				`.as("hasEvents"),
				hasLeaderboard: sql<boolean>`
					(
						SELECT COUNT(*) FROM leaderboards WHERE leaderboards.community = communities.id
					) > 0
				`.as("hasLeaderboard"),
				hasShop: sql<boolean>`
					(
						SELECT COUNT(*) > 0 FROM (
							SELECT 1 FROM products WHERE products.community = communities.id
							UNION ALL
							SELECT 1 FROM raffles WHERE raffles.community = communities.id
						)
					)
				`.as("hasShop"),
			},
		});
	},
	["getCommunity"],
	{ revalidate: 60 * 10 },
);
