"use server";

import { bets, predictions, outcomes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, sql } from "drizzle-orm";

export async function getPrediction(input: { handle: string; user?: string }) {
	return db.pgpool.query.predictions.findFirst({
		where: eq(predictions.handle, input.handle),
		with: {
			outcomes: {
				extras: {
					totalBets:
						sql<number>`(SELECT COUNT(*)::integer FROM bets WHERE bets.outcome = id)`.as(
							"totalBets",
						),
				},
			},
			bets: {
				where: input.user ? eq(bets.user, input.user) : undefined,
				limit: input.user ? undefined : 0,
			},
			event: true,
		},
		extras: {
			totalBets:
				sql<number>`(SELECT COUNT(*)::integer FROM bets WHERE bets.prediction = predictions.id)`.as(
					"totalBets",
				),
		},
	});
}

export async function getPredictions(input: { user?: string; event?: number }) {
	return db.pgpool.query.predictions.findMany({
		where: input.event ? eq(predictions.event, input.event) : undefined,
		with: {
			outcomes: {
				extras: {
					totalBets:
						sql<number>`(SELECT COUNT(*)::integer FROM bets WHERE bets.outcome = id)`.as(
							"totalBets",
						),
				},
			},
			bets: {
				where: input.user ? eq(bets.user, input.user) : undefined,
				limit: input.user ? undefined : 0,
				with: {
					outcome: true,
				},
			},
		},
		extras: {
			totalBets:
				sql<number>`(SELECT COUNT(*)::integer FROM bets WHERE bets.prediction = predictions.id)`.as(
					"totalBets",
				),
		},
	});
}
export async function simulateGains(input: {
	prediction: number;
	outcome: number;
	amount: number;
}) {
	const prediction = await db.primary.query.predictions.findFirst({
		where: eq(predictions.id, input.prediction),
		with: {
			outcomes: true,
		},
	});

	if (!prediction) {
		throw new Error("Prediction not found");
	}

	const selectedOutcome = prediction.outcomes.find(
		(o) => o.id === input.outcome,
	);
	if (!selectedOutcome) {
		throw new Error("Outcome not found");
	}

	const futureTotalPool = Number(prediction.pool) + input.amount;
	const futureOutcomePool = Number(selectedOutcome.pool) + input.amount;

	const totalWinningPool = futureOutcomePool;
	const totalLosingPool = futureTotalPool - totalWinningPool;

	const share = input.amount / totalWinningPool;

	return share * totalLosingPool;
}
