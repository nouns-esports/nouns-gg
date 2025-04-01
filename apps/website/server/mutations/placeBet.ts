"use server";

import { z } from "zod";
import { onlyRanked } from ".";
import {
	bets,
	nexus,
	outcomes,
	predictions,
} from "~/packages/db/schema/public";
import { eq, sql } from "drizzle-orm";
import { db } from "~/packages/db";
import { revalidatePath } from "next/cache";

export const placeBet = onlyRanked
	.schema(
		z.object({
			prediction: z.number(),
			outcome: z.number(),
			amount: z.number(),
		}),
	)
	.action(async ({ ctx, parsedInput }) => {
		const prediction = await db.primary.query.predictions.findFirst({
			where: eq(predictions.id, parsedInput.prediction),
			with: {
				bets: {
					where: eq(bets.user, ctx.user.id),
				},
				event: true,
			},
		});

		if (!prediction) {
			throw new Error("Prediction not found");
		}

		if (parsedInput.amount === 0 && prediction.bets.length > 0) {
			throw new Error("You can only bet for free once");
		}

		if (prediction.closed) {
			throw new Error("Prediction is closed");
		}

		if (prediction.resolved) {
			throw new Error("Prediction is resolved");
		}

		const now = new Date();

		if (prediction.start && now < new Date(prediction.start)) {
			throw new Error("Prediction is not yet started");
		}

		if (prediction.end && now > new Date(prediction.end)) {
			throw new Error("Prediction has ended");
		}

		await db.primary.transaction(async (tx) => {
			if (parsedInput.amount > 0) {
				await tx
					.update(nexus)
					.set({
						gold: sql`${nexus.gold} - ${parsedInput.amount}`,
					})
					.where(eq(nexus.id, ctx.user.id));
			}

			await tx.insert(bets).values({
				user: ctx.user.id,
				prediction: parsedInput.prediction,
				outcome: parsedInput.outcome,
				timestamp: now,
				amount: parsedInput.amount.toString(),
			});

			await tx
				.update(outcomes)
				.set({
					pool: sql`${outcomes.pool} + ${parsedInput.amount}`,
				})
				.where(eq(outcomes.id, parsedInput.outcome));

			await tx
				.update(predictions)
				.set({
					pool: sql`${predictions.pool} + ${parsedInput.amount}`,
				})
				.where(eq(predictions.id, parsedInput.prediction));
		});

		revalidatePath(`/predictions/${prediction.handle}`);
		if (prediction.event) {
			revalidatePath(`/events/${prediction.event.handle}`);
		}
	});
