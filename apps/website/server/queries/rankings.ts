import { and, asc, desc, eq, sql } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";
import { rankings } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

export const getLeaderboard = cache(
	async () => {
		return db.pgpool.query.rankings.findMany({
			where: eq(
				rankings.timestamp,
				sql`(SELECT MAX(timestamp) FROM ${rankings})`,
			),
			orderBy: desc(rankings.score),
			limit: 100,
			with: {
				rank: true,
				user: true,
				gold: true,
			},
			extras: {
				previousPosition: sql<number | null>`
					(
						SELECT rank_index FROM (
							SELECT 
								"user",
								ROW_NUMBER() OVER (ORDER BY score DESC) AS rank_index
							FROM ${rankings}
							WHERE timestamp = (
								SELECT timestamp 
								FROM ${rankings} 
								WHERE timestamp < (SELECT MAX(timestamp) FROM ${rankings})
								ORDER BY timestamp DESC 
								LIMIT 1
							)
						) AS ranked
						WHERE ranked."user" = rankings."user"
					)
				`.as("previousPosition"),
			},
		});
	},
	["getLeaderboard"],
	{ tags: ["getLeaderboard"], revalidate: 60 * 10 },
);

export const getLeaderboardPosition = cache(
	async (input: { user: string }) => {
		return db.pgpool.query.rankings.findFirst({
			where: and(
				eq(rankings.user, input.user),

				eq(rankings.timestamp, sql`(SELECT MAX(timestamp) FROM ${rankings})`),
			),
			orderBy: desc(rankings.score),
			with: {
				rank: true,
				user: true,
				gold: true,
			},
			extras: {
				position: sql<number>`(
					SELECT rank_index FROM (
						SELECT 
							"user",
							ROW_NUMBER() OVER (ORDER BY score DESC) AS rank_index
						FROM ${rankings}
						WHERE timestamp = (SELECT MAX(timestamp) FROM ${rankings})
					) AS ranked
					WHERE ranked."user" = rankings."user"
				)`.as("position"),
				previousPosition: sql<number | null>`(
					SELECT rank_index FROM (
						SELECT 
							"user",
							ROW_NUMBER() OVER (ORDER BY score DESC) AS rank_index
						FROM ${rankings}
						WHERE timestamp = (
							SELECT timestamp 
							FROM ${rankings} 
							WHERE timestamp < (SELECT MAX(timestamp) FROM ${rankings})
							ORDER BY timestamp DESC 
							LIMIT 1
						)
					) AS ranked
					WHERE ranked."user" = rankings."user"
				)`.as("previousPosition"),
			},
		});
	},
	["getLeaderboardPosition"],
	{ tags: ["getLeaderboardPosition"], revalidate: 60 * 10 },
);

export const getUserRankings = cache(
	async (input: { user: string }) => {
		return db.pgpool.query.rankings.findMany({
			where: eq(rankings.user, input.user),
			orderBy: asc(rankings.timestamp),
			with: {
				rank: true,
			},
		});
	},
	["getUserRankings"],
	{ tags: ["getUserRankings"], revalidate: 60 * 10 },
);
