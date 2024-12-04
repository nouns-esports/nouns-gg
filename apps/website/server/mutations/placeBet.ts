"use server";

import { z } from "zod";
import { onlyRanked } from ".";
import { bets, outcomes, predictions } from "~/packages/db/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "~/packages/db/schema";
import { revalidatePath } from "next/cache";

export const placeBet = onlyRanked
	.schema(
		z.object({
			prediction: z.string(),
			outcome: z.number(),
		}),
	)
	.action(async ({ ctx, parsedInput }) => {
		const prediction = await db.query.predictions.findFirst({
			where: eq(predictions.id, parsedInput.prediction),
			with: {
				bets: {
					where: eq(bets.user, ctx.user.id),
				},
			},
		});

		if (!prediction) {
			throw new Error("Prediction not found");
		}

		if (prediction.bets.length > 0) {
			throw new Error("You have already placed a bet on this prediction");
		}

		await db.transaction(async (tx) => {
			await tx.insert(bets).values({
				user: ctx.user.id,
				prediction: parsedInput.prediction,
				outcome: parsedInput.outcome,
				timestamp: new Date(),
			});
			await tx
				.update(outcomes)
				.set({
					totalBets: sql`${outcomes.totalBets} + 1`,
				})
				.where(eq(outcomes.id, parsedInput.outcome));
		});

		revalidatePath(`/predictions/${parsedInput.prediction}`);
		revalidatePath(`/events/${prediction.event}`);
	});
