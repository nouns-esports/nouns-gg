import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { communities, votes } from "~/packages/db/schema/public";

export const castVote = createAction({
	name: "Cast Vote",
	schema: z.object({
		round: z.string().uuid().describe("The round to cast a vote for"),
	}),
	check: async ({ user, community }) => {
		const communityVotes = await db.primary.query.communities.findFirst({
			where: eq(communities.id, community.id),
			with: {
				rounds: {
					with: {
						votes: {
							where: eq(votes.user, user.id),
							limit: 1,
						},
					},
				},
			},
		});

		if (!communityVotes) return false;

		return communityVotes.rounds.some((round) => round.votes.length > 0);
	},
});
