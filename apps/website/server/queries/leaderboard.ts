import { db } from "~/packages/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { leaderboards } from "~/packages/db/schema/public";

export async function getLeaderboard(input: { community: number }) {
	return db.pgpool.query.leaderboards.findMany({
		where: eq(leaderboards.community, input.community),
		orderBy: [desc(leaderboards.xp)],
		limit: 100,
		with: {
			user: {
				with: {
					profile: true,
				},
			},
		},
	});
}

export async function getRank(input: { user: string; community: number }) {
	return db.pgpool.query.leaderboards.findFirst({
		where: and(
			eq(leaderboards.community, input.community),
			eq(leaderboards.user, input.user),
		),
		orderBy: [desc(leaderboards.xp)],
		with: {
			user: {
				with: {
					profile: true,
				},
			},
		},
		extras: {
			rank: sql<number>`ROW_NUMBER() OVER (ORDER BY xp DESC)`.as("rank"),
		},
	});
}
