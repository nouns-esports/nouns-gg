import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { leaderboards } from "~/packages/db/schema/public";

export const reachPercentile = createAction({
	name: "Reach Percentile",
	schema: z.object({
		percentile: z.number().describe("The percentile to reach"),
	}),
	check: async ({ user, community, input }) => {
		const pass = await db.primary.query.leaderboards.findFirst({
			where: and(
				eq(leaderboards.user, user.id),
				eq(leaderboards.community, community.id),
			),
			extras: {
				percentile: sql<number>`
                (
                    (
                        SELECT 1 + COUNT(*) 
                        FROM ${leaderboards} AS l2 
                        WHERE l2.community = ${leaderboards.community}
                        AND l2.xp > ${leaderboards.xp}
                    )::float
                    /
                    (
                        SELECT COUNT(*) 
                        FROM ${leaderboards} AS l3 
                        WHERE l3.community = ${leaderboards.community}
                    )
                )
            `.as("percentile"),
			},
		});

		if (!pass) return false;

		return pass.percentile <= input.percentile;
	},
});
