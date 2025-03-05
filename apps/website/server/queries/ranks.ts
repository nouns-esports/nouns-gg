import { unstable_cache as cache } from "next/cache";
import { db } from "~/packages/db/schema/public";

export const getCurrentRanks = cache(
	async () => {
		return db.query.ranks.findMany();
	},
	["getCurrentRanks"],
	{ tags: ["getCurrentRanks"], revalidate: 60 * 10 },
);
