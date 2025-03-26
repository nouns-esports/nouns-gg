import { communities } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getCommunities = cache(
	async (input?: { ids?: string[] }) => {
		return db.pgpool.query.communities.findMany({
			where: and(input?.ids ? inArray(communities.id, input.ids) : undefined),
			orderBy: asc(communities.name),
		});
	},
	["getCommunities"],
	{ revalidate: 60 * 10 },
);

export const getCommunity = cache(
	async (input: { id: string }) => {
		return db.pgpool.query.communities.findFirst({
			where: eq(communities.id, input.id),
		});
	},
	["getCommunity"],
	{ revalidate: 60 * 10 },
);
