import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { leaderboards, nexus } from "~/packages/db/schema/public";

export const leaderboardPosition = createAction({
	name: "Leaderboard Position",
	schema: z.object({
		minPosition: z.number().describe("The minimum position to reach"),
	}),
	check: async ({ user, community, input }) => {
		const data = await db.pgpool.query.nexus.findFirst({
			where: eq(nexus.id, user.id),
			with: {
				leaderboards: {
					where: eq(leaderboards.community, community.id),
					extras: {
						rank: sql<number>`
						(
						  SELECT COUNT(*) + 1
						  FROM ${leaderboards} AS p2
						  WHERE p2.community = ${leaderboards.community}
							AND p2.xp > ${leaderboards.xp}
						)
					  `.as("rank"),
					},
				},
			},
		});

		if (!data?.leaderboards[0]) return false;

		return data.leaderboards[0].rank <= input.minPosition;
	},
});
