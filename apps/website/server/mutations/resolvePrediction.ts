"use server";

import { onlyUser } from ".";
import { z } from "zod";
import { db } from "~/packages/db";
import {
	nexus,
	gold,
	predictions,
	outcomes,
} from "~/packages/db/schema/public";
import { eq, sql } from "drizzle-orm";

export const resolvePrediction = onlyUser
	.schema(
		z.object({
			prediction: z.number(),
			winningOutcomes: z.array(z.number()),
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

		const now = new Date();

		const winningOutcomes = prediction.outcomes.filter((outcome) =>
			parsedInput.winningOutcomes.includes(outcome.id),
		);
		const losingOutcomes = prediction.outcomes.filter(
			(outcome) => !parsedInput.winningOutcomes.includes(outcome.id),
		);

		const losingPool = losingOutcomes.reduce(
			(acc, outcome) => acc + Number(outcome.pool),
			0,
		);
		const splitLosingPool = losingPool / winningOutcomes.length;
		const totalUserWinnings: Record<string, number> = {};

		for (const winningOutcome of winningOutcomes) {
			const outcomeStakedPool = Number(winningOutcome.pool);
			const winningPool = outcomeStakedPool + splitLosingPool;
			const outcomeBetsPerUser: Record<string, number> = {};

			for (const bet of winningOutcome.bets) {
				if (Number(bet.amount) > 0) {
					outcomeBetsPerUser[bet.user] =
						(outcomeBetsPerUser[bet.user] ?? 0) + Number(bet.amount);
				}
			}

			const outcomeTotalStakes = Object.values(outcomeBetsPerUser).reduce(
				(a, b) => a + b,
				0,
			);

			for (const [user, stake] of Object.entries(outcomeBetsPerUser)) {
				const share = stake / outcomeTotalStakes;
				const winnings = Number(share * winningPool);

				totalUserWinnings[user] = (totalUserWinnings[user] ?? 0) + winnings;
			}
		}

		await db.primary.transaction(async (tx) => {
			for (const winningOutcome of winningOutcomes) {
				await tx
					.update(outcomes)
					.set({
						result: true,
					})
					.where(eq(outcomes.id, winningOutcome.id));
			}

			for (const losingOutcome of losingOutcomes) {
				await tx
					.update(outcomes)
					.set({
						result: false,
					})
					.where(eq(outcomes.id, losingOutcome.id));
			}

			await tx
				.update(predictions)
				.set({
					resolved: true,
				})
				.where(eq(predictions.id, prediction.id));

			for (const [user, winnings] of Object.entries(totalUserWinnings)) {
				await tx
					.update(nexus)
					.set({
						gold: sql`${nexus.gold} + ${winnings.toFixed(2)}`,
					})
					.where(eq(nexus.id, user));

				await tx.insert(gold).values({
					to: user,
					amount: winnings.toFixed(2),
					prediction: prediction.id,
					timestamp: now,
				});
			}
		});
	});
