import { rosters } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getRosters = cache(
	async (input?: { limit?: number }) => {
		return db.query.rosters.findMany({
			where: eq(rosters.active, true),
			limit: input?.limit,
			with: {
				community: true,
				talent: true,
			},
		});
	},
	["getRosters"],
	{ revalidate: 60 * 10 },
);
