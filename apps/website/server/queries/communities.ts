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
						SELECT COUNT(*) FROM archive.rounds WHERE archive.rounds.community = archive.communities.id
					) > 0
				`.as("hasRounds"),
				hasQuests: sql<boolean>`
					(
						SELECT COUNT(*) FROM archive.quests WHERE archive.quests.community = archive.communities.id AND archive.quests.active = true
					) > 0
				`.as("hasQuests"),
				hasPredictions: sql<boolean>`
					(	
						SELECT COUNT(*) FROM archive.predictions WHERE archive.predictions.community = archive.communities.id
					) > 0
				`.as("hasPredictions"),
				hasEvents: sql<boolean>`
					(
						SELECT COUNT(*) FROM archive.events WHERE archive.events.community = archive.communities.id
					) > 0
				`.as("hasEvents"),
				hasLeaderboard: sql<boolean>`
					(
						SELECT COUNT(*) FROM archive.leaderboards WHERE archive.leaderboards.community = archive.communities.id
					) > 0
				`.as("hasLeaderboard"),
				hasShop: sql<boolean>`
					(
						SELECT COUNT(*) FROM archive.products WHERE archive.products.community = archive.communities.id
					) > 0
				`.as("hasShop"),
			},
		});
	},
	["getCommunity"],
	{ revalidate: 60 * 10 },
);
