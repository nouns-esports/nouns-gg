import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { communities, proposals } from "~/packages/db/schema/public";

export const createProposal = createAction({
	name: "Create Proposal",
	schema: z.object({
		round: z.string().uuid().describe("The round to create a proposal for"),
	}),
	check: async ({ user, community }) => {
		const communityProposals = await db.primary.query.communities.findFirst({
			where: eq(communities.id, community.id),
			with: {
				rounds: {
					with: {
						proposals: {
							where: eq(proposals.user, user.id),
							limit: 1,
						},
					},
				},
			},
		});

		if (!communityProposals) return false;

		return communityProposals.rounds.some(
			(round) => round.proposals.length > 0,
		);
	},
});
