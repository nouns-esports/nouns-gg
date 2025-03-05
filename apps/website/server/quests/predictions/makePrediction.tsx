import { and, eq } from "drizzle-orm";
import createAction from "../createAction";
import { bets, predictions } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

export const makePrediction = createAction<{ prediction?: string }>(
	async (actionInputs) => {
		let prediction:
			| Awaited<ReturnType<typeof db.query.predictions.findFirst>>
			| undefined;

		if (actionInputs.prediction) {
			prediction = await db.query.predictions.findFirst({
				where: eq(predictions.id, actionInputs.prediction),
			});
		}

		return {
			description: prediction ? (
				<p>
					Make a prediction on
					<span className="text-red">{prediction.name}</span>
				</p>
			) : (
				<p>Make a prediction</p>
			),
			url: "/events/nounsvitational#predictions",
			check: async (user) => {
				const bet = await db.query.bets.findFirst({
					where: and(
						eq(bets.user, user.id),
						prediction ? eq(bets.prediction, prediction.id) : undefined,
					),
				});

				if (!bet) return false;

				return true;
			},
		};
	},
);
