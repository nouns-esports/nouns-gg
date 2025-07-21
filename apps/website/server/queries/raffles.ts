import { db } from "~/packages/db";
import { and, eq, isNull, sql } from "drizzle-orm";
import { raffles } from "~/packages/db/schema/public";

export async function getRaffles(input?: {
	event?: string;
	user?: string;
	community?: string;
}) {
	const now = new Date();

	return db.pgpool.query.raffles.findMany({
		where: (t, { eq, gt, lt, and }) =>
			and(
				lt(t.start, now),
				gt(t.end, now),
				input?.event ? eq(t.event, input.event) : undefined,
				input?.community ? eq(t.community, input.community) : undefined,
				eq(t.active, true),
				isNull(t.deletedAt),
			),
		with: {
			entries: {
				where: (t, { eq }) =>
					input?.user ? eq(t.user, input.user) : undefined,
			},
			community: true,
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
}

export async function getRaffle(
	input: { user?: string } & (
		| { id: string }
		| { handle: string; community?: string }
	),
) {
	return db.pgpool.query.raffles.findFirst({
		where:
			"id" in input
				? eq(raffles.id, input.id)
				: and(
						eq(raffles.handle, input.handle),
						input.community
							? eq(raffles.community, input.community)
							: undefined,
					),
		with: {
			community: true,
		},
	});
}
