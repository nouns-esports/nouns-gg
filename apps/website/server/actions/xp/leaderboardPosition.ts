import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { leaderboards } from "~/packages/db/schema/public";

export const leaderboardPosition = createAction({
	name: "Leaderboard Position",
	schema: z.object({
		minPosition: z.number().describe("The minimum position to reach"),
	}),
	check: async ({ user, community, input }) => {
		const pass = await db.pgpool.query.leaderboards.findFirst({
			where: and(
				eq(leaderboards.community, community.id),
				eq(leaderboards.user, user.id),
			),
			orderBy: [desc(leaderboards.xp)],
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
		});

		if (!pass) return false;

		return pass.rank <= input.minPosition;
	},
});
