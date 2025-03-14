import { communities, rosters, talent } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getCommunities = cache(
	async (input?: { ids?: string[] }) => {
		return db.pgpool.query.communities.findMany({
			where: and(
				input?.ids ? inArray(communities.id, input.ids) : undefined,
				isNull(communities.parent),
			),
			orderBy: asc(communities.name),
			with: {
				children: true,
			},
		});
	},
	["getCommunities"],
	{ revalidate: 60 * 10 },
);

export const getCommunity = cache(
	async (input: { id: string }) => {
		return db.pgpool.query.communities.findFirst({
			where: eq(communities.id, input.id),
			with: {
				children: true,
			},
		});
	},
	["getCommunity"],
	{ revalidate: 60 * 10 },
);

export const getCommunityRosters = cache(
	async (input: { community: string }) => {
		return db.pgpool.query.rosters.findMany({
			where: and(
				eq(rosters.community, input.community),
				eq(rosters.active, true),
			),
			with: {
				community: true,
				talent: {
					where: eq(talent.active, true),
				},
			},
		});
	},
	["getCommunityRosters"],
	{ revalidate: 60 * 10 },
);
