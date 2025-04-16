import { communities } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getCommunities = cache(
	async (input?: { handles?: string[] }) => {
		return db.pgpool.query.communities.findMany({
			where: and(
				input?.handles ? inArray(communities.handle, input.handles) : undefined,
			),
			orderBy: asc(communities.name),
		});
	},
	["getCommunities"],
	{ revalidate: 60 * 10 },
);

export const getCommunity = cache(
	async (input: { handle: string }) => {
		//
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
						SELECT COUNT(*) FROM quests WHERE quests.community = communities.id AND quests.active = true
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
			},
		});
	},
	["getCommunity"],
	{ revalidate: 60 * 10 },
);
