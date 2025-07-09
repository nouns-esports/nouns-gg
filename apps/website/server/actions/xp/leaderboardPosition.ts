import { z } from "zod";
import { createAction } from "../createAction";
import { leaderboards } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, desc, eq, sql } from "drizzle-orm";

export const leaderboardPosition = createAction({
	image: "",
	name: "Leaderboard Position",
	category: "xp",
	generateDescription: async (inputs) => {
		"use server";

		return [];
	},
	check: async ({ inputs, user }) => {
		"use server";

		if (!user.nexus) return false;

		const pass = await db.pgpool.query.leaderboards.findFirst({
			where: and(
				eq(leaderboards.community, inputs.community.id),
				eq(leaderboards.user, user.id),
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

		if (!pass) return false;

		return pass.rank <= inputs.top.value;
	},
	filters: {
		top: {
			required: true,
			options: {
				value: {
					name: "Top",
					description: "The minimum position to reach",
					schema: z.number(),
				},
			},
			name: "Top",
		},
		community: {
			required: true,
			options: {
				id: { name: "ID", description: "The community ID", schema: z.string() },
			},
			name: "Community",
		},
	},
});
