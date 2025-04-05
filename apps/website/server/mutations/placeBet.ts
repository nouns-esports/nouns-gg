"use server";

import { z } from "zod";
import { onlyUser } from ".";
import {
	bets,
	gold,
	nexus,
	outcomes,
	predictions,
	xp,
} from "~/packages/db/schema/public";
import { eq, sql, and } from "drizzle-orm";
import { db } from "~/packages/db";
import { revalidatePath } from "next/cache";

export const placeBet = onlyUser
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
				outcomes: {
					where: eq(outcomes.id, parsedInput.outcome),
				},
				bets: {
					where: and(
						eq(bets.user, ctx.user.id),
						eq(bets.prediction, parsedInput.prediction),
					),
				},
				event: true,
				earnedXP: {
					where: eq(xp.user, ctx.user.id),
				},
			},
		});

		if (!prediction) {
			throw new Error("Prediction not found");
		}

		if (prediction.outcomes.length === 0) {
			throw new Error("Outcome not found");
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
			const amount = parsedInput.amount.toFixed(0);

			const [bet] = await tx
				.insert(bets)
				.values({
					user: ctx.user.id,
					prediction: parsedInput.prediction,
					outcome: parsedInput.outcome,
					timestamp: now,
					amount,
				})
				.returning({ id: bets.id });

			if (parsedInput.amount > 0) {
				await tx
					.update(nexus)
					.set({
						gold: sql`${nexus.gold} - ${amount}`,
					})
					.where(eq(nexus.id, ctx.user.id));

				await tx.insert(gold).values({
					from: ctx.user.id,
					amount,
					timestamp: now,
					bet: bet.id,
				});
			}

			if (prediction.earnedXP.length === 0) {
				await tx.insert(xp).values({
					user: ctx.user.id,
					amount: prediction.xp,
					timestamp: now,
					prediction: prediction.id,
				});

				await tx
					.update(nexus)
					.set({
						xp: sql`${nexus.xp} + ${prediction.xp}`,
					})
					.where(eq(nexus.id, ctx.user.id));
			}

			await tx
				.update(outcomes)
				.set({
					pool: sql`${outcomes.pool} + ${amount}`,
				})
				.where(eq(outcomes.id, parsedInput.outcome));

			await tx
				.update(predictions)
				.set({
					pool: sql`${predictions.pool} + ${amount}`,
				})
				.where(eq(predictions.id, parsedInput.prediction));
		});

		revalidatePath(`/predictions/${prediction.handle}`);
		revalidatePath("/predictions");
		if (prediction.event) {
			revalidatePath(`/events/${prediction.event.handle}`);
		}
	});
