import { communities } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
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
