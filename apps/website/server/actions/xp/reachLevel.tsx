import { z } from "zod";
import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { eq } from "drizzle-orm";
import { communities } from "~/packages/db/schema/public";
import { level } from "@/utils/level";

export const reachLevel = createAction({
	schema: z.object({
		level: z.number().describe("The XP level to reach"),
		community: z.number().describe("The community to reach the level in"),
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
					Reach level {inputs.level} in {community.name}
				</p>
			),
			url: `/communities/${community.handle}`,
			check: async (user) => {
				if (!user.nexus) {
					return false;
				}

				const { currentLevel } = level(user.nexus.xp);

				return currentLevel < inputs.level;
			},
		};
	},
});
