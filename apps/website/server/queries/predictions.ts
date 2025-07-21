"use server";

import { bets, predictions, outcomes, gold } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, desc, eq, isNull, sql } from "drizzle-orm";

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
			outcomes: {
				extras: {
					totalBets:
						sql<number>`(SELECT COUNT(*) FROM bets WHERE bets.outcome = predictions_outcomes.id)::integer`.as(
							"totalBets",
						),
				},
			},
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
				sql<number>`(SELECT COUNT(*) FROM bets WHERE bets.prediction = predictions.id)::integer`.as(
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
			eq(predictions.active, true),
			isNull(predictions.deletedAt),
		),
		orderBy: [desc(predictions.id)],
		limit: input.limit,
		with: {
			community: true,
			outcomes: {
				extras: {
					totalBets:
						sql<number>`(SELECT COUNT(*) FROM bets WHERE bets.outcome = predictions_outcomes.id)::integer`.as(
							"totalBets",
						),
				},
			},
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
				sql<number>`(SELECT COUNT(*) FROM bets WHERE bets.prediction = predictions.id)::integer`.as(
					"totalBets",
				),
		},
	});
}
