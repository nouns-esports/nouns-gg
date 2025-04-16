import { z } from "zod";
import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { eq, sql } from "drizzle-orm";
import { communities, nexus } from "~/packages/db/schema/public";
import { level } from "@/utils/level";

export const reachPercentile = createAction({
	schema: z.object({
		percentile: z.number().describe("The XP percentile to reach"),
		community: z.number().describe("The community to reach the percentile in"),
	}),
	create: async (inputs) => {
		const community = await db.pgpool.query.communities.findFirst({
			where: eq(communities.id, inputs.community),
		});

		if (!community) {
			throw new Error("Community not found");
		}

		return {
			description: (
				<p>
					Reach top {inputs.percentile}% in {community.name}
				</p>
			),
			url: `/communities/${community.handle}`,
			check: async (user) => {
				if (!user.nexus) {
					return false;
				}

				const [{ rank, total }] = await db.pgpool
					.select({
						rank: sql<number>`rank() over (order by ${nexus.xp} desc)`.as(
							"rank",
						),
						total: sql<number>`count(*)`.as("total"),
					})
					.from(nexus);

				const percentile = (rank / total) * 100;

				return percentile < inputs.percentile;
			},
		};
	},
});
