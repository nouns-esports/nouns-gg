"use server";

import { env } from "~/env";
import { onlyUser } from ".";
import { z } from "zod";
import { db } from "~/packages/db";
import { predictions } from "~/packages/db/schema/public";

export const resolvePrediction = onlyUser
	.schema(
		z.object({
			prediction: z.number(),
			outcomes: z.array(z.number()),
		}),
	)
	.action(async ({ parsedInput }) => {
		const prediction = await db.primary.query.predictions.findFirst({
			where: (t, { eq }) => eq(predictions.id, parsedInput.prediction),
			with: {
				outcomes: {
					with: {
						bets: true,
					},
				},
			},
		});

		if (!prediction) {
			throw new Error("Prediction not found");
		}

		if (!prediction.closed) {
			throw new Error("Prediction must be closed before resolving");
		}

		if (prediction.resolved) {
			throw new Error("Prediction already resolved");
		}

		for (const outcome of parsedInput.outcomes) {
			if (!prediction.outcomes.some((o) => o.id === outcome)) {
				throw new Error(`Invalid outcome: ${outcome}`);
			}
		}

		const winningOutcomes = prediction.outcomes.filter((outcome) => {
			return parsedInput.outcomes.includes(outcome.id);
		});

		const losingOutcomes = prediction.outcomes.filter(
			(outcome) => !parsedInput.outcomes.includes(outcome.id),
		);

		const winningPool = winningOutcomes.reduce((acc, outcome) => {
			return acc + Number(outcome.pool);
		}, 0);

		const losingPool = losingOutcomes.reduce((acc, outcome) => {
			return acc + Number(outcome.pool);
		}, 0);

		const winningBets: Record<string, number> = {};

		for (const outcome of winningOutcomes) {
			for (const bet of outcome.bets) {
				winningBets[bet.user] =
					(winningBets[bet.user] ?? 0) + Number(bet.amount);
			}
		}

		await db.primary.transaction(async (tx) => {
			for (const [user, stake] of Object.entries(winningBets)) {
				const share = stake / winningPool;
				const winnings = share * losingPool;
			}
		});
	});
