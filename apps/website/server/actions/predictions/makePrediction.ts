import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { bets, communities } from "~/packages/db/schema/public";

export const makePrediction = createAction({
	name: "Make Prediction",
	schema: z.object({}),
	check: async ({ user, community }) => {
		const communityBets = await db.primary.query.communities.findFirst({
			where: eq(communities.id, community.id),

			with: {
				predictions: {
					with: {
						bets: {
							where: eq(bets.user, user.id),
							limit: 1,
						},
					},
				},
			},
		});

		if (!communityBets) return false;

		return communityBets.predictions.some(
			(prediction) => prediction.bets.length > 0,
		);
	},
});
