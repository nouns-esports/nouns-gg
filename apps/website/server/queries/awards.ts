import { awards, proposals } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

import { eq, asc, desc, and, gt } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getAwards = cache(
	async (input: { round: string }) => {
		return db.pgpool.query.awards.findMany({
			where: eq(awards.round, input.round),
			orderBy: asc(awards.place),
			with: {
				asset: true,
			},
		});
	},
	["awards"],
	{ tags: ["awards"], revalidate: 60 * 10 },
);
