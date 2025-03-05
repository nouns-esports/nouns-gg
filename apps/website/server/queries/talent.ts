import { talent } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, and, asc } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getTalent = cache(
	async (input: { roster: string }) => {
		return db.query.talent.findMany({
			where: and(eq(talent.active, true), eq(talent.roster, input.roster)),
			orderBy: asc(talent.name),
		});
	},
	["talent"],
	{ revalidate: 60 * 10 },
);
