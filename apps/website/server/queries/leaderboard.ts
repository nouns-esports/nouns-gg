import { db } from "~/packages/db";
import { and, desc, eq, sql } from "drizzle-orm";
import { leaderboards } from "~/packages/db/schema/public";

export async function getLeaderboard(input: { community: number }) {
	return db.pgpool.query.leaderboards.findMany({
		where: eq(leaderboards.community, input.community),
		orderBy: [desc(leaderboards.xp)],
		limit: 100,
		with: {
			user: true,
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
			user: true,
		},
		extras: {
			rank: sql<number>`
        (
          SELECT COUNT(*) + 1
          FROM ${leaderboards} AS lb2
          WHERE lb2.community = ${leaderboards.community}
            AND lb2.xp > ${leaderboards.xp}
        )
      `.as("rank"),
		},
	});
}
