"use server";

import { z } from "zod";
import { onlyUser } from ".";
import { bets, outcomes, predictions, xp } from "~/packages/db/schema/public";
import { eq, and } from "drizzle-orm";
import { db } from "~/packages/db";
import { posthogClient } from "../clients/posthog";

export const placeBet = onlyUser
	.schema(
		z.object({
			prediction: z.string(),
			outcome: z.string(),
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

		if (prediction.bets.length > 0) {
			throw new Error("You already placed a prediction");
		}

		// let didEarnXP = false;
		// let newUserXP = 0;

		await db.primary.transaction(async (tx) => {
			const [bet] = await tx
				.insert(bets)
				.values({
					user: ctx.user.id,
					prediction: parsedInput.prediction,
					outcome: parsedInput.outcome,
					amount: 0,
				})
				.returning({ id: bets.id });

			// if (prediction.earnedXP.length === 0) {
			// 	await tx.insert(xp).values({
			// 		user: ctx.user.id,
			// 		amount: prediction.xp,
			// 		timestamp: now,
			// 		prediction: prediction.id,
			// 	});

			// 	const [updateNexus] = await tx
			// 		.update(nexus)
			// 		.set({
			// 			xp: sql`${nexus.xp} + ${prediction.xp}`,
			// 		})
			// 		.where(eq(nexus.id, ctx.user.id))
			// 		.returning({
			// 			xp: nexus.xp,
			// 		});

			// 	newUserXP = updateNexus.xp;
			// 	didEarnXP = true;
			// }
		});

		posthogClient.capture({
			event: "prediction-placed",
			distinctId: ctx.user.id,
			properties: {
				prediction: prediction.id,
				outcome: parsedInput.outcome,
				community: prediction.community,
				amount: 0,
			},
		});

		// if (didEarnXP) {
		// 	return {
		// 		earnedXP: prediction.xp,
		// 		totalXP: newUserXP,
		// 	};
		// }
	});
