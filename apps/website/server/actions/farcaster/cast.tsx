import { z } from "zod";
import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { and, eq, sql } from "drizzle-orm";
import { communities } from "~/packages/db/schema/public";
import { casts } from "~/packages/db/schema/farcaster";

export const cast = createAction({
	schema: z.object({
		community: z.string().describe("The community to cast to"),
		regex: z.string().optional().describe("Regex pattern to match text"),
		label: z.string().optional().describe("What the user is sharing"),
	}),
	create: async (input) => {
		const community = await db.primary.query.communities.findFirst({
			where: eq(communities.handle, input.community),
		});

		if (!community) {
			throw new Error("Community not found");
		}

		return {
			description: (
				<p>
					{input.label ?? "Cast"} in the{" "}
					<span className="text-red">/{community.name}</span> community
				</p>
			),
			url: "/user",
			check: async (user) => {
				if (!user.farcaster) return false;

				const hasCast = await db.primary.query.casts.findFirst({
					where: and(
						eq(casts.fid, user.farcaster.fid),
						input.regex ? sql`${casts.text} ~ ${input.regex}` : undefined,
					),
				});

				return !!hasCast;
			},
		};
	},
});
