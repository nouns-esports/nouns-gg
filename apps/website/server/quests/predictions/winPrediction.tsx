import { and, eq } from "drizzle-orm";
import createAction from "../createAction";
import { bets, predictions } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

export const winPrediction = createAction<{ prediction: number }>(
	async (actionInputs) => {
		if (!actionInputs.prediction) {
			throw new Error("No prediction in action");
		}

		const prediction = await db.primary.query.predictions.findFirst({
			where: eq(predictions.id, actionInputs.prediction),
			with: {
				outcomes: true,
			},
		});

		if (!prediction) {
			throw new Error("Prediction not found");
		}

		return {
			description: (
				<p>
					Make a prediction on
					<span className="text-red">{prediction.name}</span>
				</p>
			),
			url: `/predictions/${prediction.id}`,
			check: async (user) => {
				const bet = await db.primary.query.bets.findFirst({
					where: and(
						eq(bets.user, user.id),
						eq(bets.prediction, prediction.id),
					),
				});

				if (!bet) return false;

				const winningOutcomes = prediction.outcomes.filter(
					(outcome) => outcome.outcome,
				);

				return winningOutcomes.some((outcome) => outcome.id === bet.outcome);
			},
		};
	},
);
