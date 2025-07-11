"use server";

import { bets, predictions, outcomes, gold } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, desc, eq, sql } from "drizzle-orm";

export async function getPrediction(
	input: { user?: string } & (
		| { handle: string; community?: string }
		| { id: string }
	),
) {
	return db.pgpool.query.predictions.findFirst({
		where:
			"id" in input
				? eq(predictions.id, input.id)
				: and(
						eq(predictions.handle, input.handle),
						input.community
							? eq(
									predictions.community,
									sql`(SELECT id FROM communities WHERE communities.handle = ${input.community})`,
								)
							: undefined,
					),
		with: {
			outcomes: true,
			bets: {
				where: input.user ? eq(bets.user, input.user) : undefined,
				limit: input.user ? 1 : 0,
				with: {
					outcome: true,
				},
			},
			event: true,
			gold: {
				where: input.user ? eq(gold.to, input.user) : undefined,
				limit: input.user ? 1 : 0,
			},
			community: true,
		},
		extras: {
			totalBets:
				sql<number>`(SELECT COUNT(*) FROM bets WHERE bets.prediction = predictions.id)`.as(
					"totalBets",
				),
		},
	});
}

export async function getPredictions(input: {
	user?: string;
	event?: string;
	community?: string;
	limit?: number;
}) {
	return db.pgpool.query.predictions.findMany({
		where: and(
			input.event ? eq(predictions.event, input.event) : undefined,
			input.community ? eq(predictions.community, input.community) : undefined,
			eq(predictions.draft, false),
		),
		orderBy: [desc(predictions.id)],
		limit: input.limit,
		with: {
			community: true,
			outcomes: true,
			bets: {
				where: input.user ? eq(bets.user, input.user) : undefined,
				limit: input.user ? 1 : 0,
				with: {
					outcome: true,
				},
			},
			gold: {
				where: input.user ? eq(gold.to, input.user) : undefined,
				limit: input.user ? 1 : 0,
			},
		},
		extras: {
			totalBets:
				sql<number>`(SELECT COUNT(*) FROM bets WHERE bets.prediction = predictions.id)`.as(
					"totalBets",
				),
		},
	});
}
export async function simulateGains(input: {
	prediction: string;
	outcome: string;
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
