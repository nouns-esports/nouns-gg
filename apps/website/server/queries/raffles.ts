import { unstable_cache as cache } from "next/cache";
import { db } from "~/packages/db";
import { raffleEntries, raffles } from "~/packages/db/schema/public";
import { sql } from "drizzle-orm";

export const getRaffles = cache(
	async () => {
		const now = new Date();

		return db.pgpool.query.raffles.findMany({
			where: (t, { gt, lt, and }) => and(lt(t.start, now), gt(t.end, now)),
			extras: {
				totalEntries: sql<number>`
                    (
                        SELECT COALESCE(SUM(${raffleEntries.amount}), 0)::integer
                        FROM ${raffleEntries}
                        WHERE ${raffleEntries.raffle} = ${raffles.id.getSQL()}
                    )
	            `.as("totalEntries"),
			},
		});
	},
	["getRaffles"],
	{ tags: ["getRaffles"], revalidate: 60 * 10 },
);
