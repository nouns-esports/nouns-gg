import { unstable_cache as cache } from "next/cache";
import { db } from "~/packages/db";
import { eq, sql } from "drizzle-orm";

export const getRaffles = cache(
	async (input?: { event?: string; user?: string; community?: string }) => {
		const now = new Date();

		return db.pgpool.query.raffles.findMany({
			where: (t, { eq, gt, lt, and }) =>
				and(
					lt(t.start, now),
					gt(t.end, now),
					input?.event ? eq(t.event, input.event) : undefined,
					input?.community ? eq(t.community, input.community) : undefined,
					eq(t.draft, false),
				),
			with: {
				entries: {
					where: (t, { eq }) =>
						input?.user ? eq(t.user, input.user) : undefined,
				},
			},
			extras: {
				totalEntries: sql<number>`
                    (
                        SELECT COALESCE(SUM(amount), 0)::integer
                        FROM raffle_entries
                        WHERE raffle = raffles.id
                    )
	            `.as("totalEntries"),
			},
		});
	},
	["getRaffles"],
	{ tags: ["getRaffles"], revalidate: 60 * 10 },
);
