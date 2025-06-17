"use server";

import { z } from "zod";
import { onlyUser } from ".";
import {
	bets,
	gold,
	leaderboards,
	nexus,
	outcomes,
	predictions,
	xp,
} from "~/packages/db/schema/public";
import { eq, sql, and } from "drizzle-orm";
import { db } from "~/packages/db";
import { revalidatePath } from "next/cache";
import { posthogClient } from "../clients/posthog";

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

		// let didEarnXP = false;
		// let newUserXP = 0;

		await db.primary.transaction(async (tx) => {
			const [bet] = await tx
				.insert(bets)
				.values({
					user: ctx.user.id,
					prediction: parsedInput.prediction,
					outcome: parsedInput.outcome,
					timestamp: now,
					amount: parsedInput.amount,
				})
				.returning({ id: bets.id });

			if (parsedInput.amount > 0) {
				await tx.insert(leaderboards).values({
					user: ctx.user.id,
					community: prediction.community,
				}).onConflictDoUpdate({
					target: [leaderboards.user, leaderboards.community],
					set: {
						points: sql`${leaderboards.points} - ${parsedInput.amount}`,
					},
				});

				await tx.insert(gold).values({
					from: ctx.user.id,
					amount: parsedInput.amount,
					bet: bet.id,
					community: prediction.community,
				});
			}

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

		posthogClient.capture({
			event: "prediction-placed",
			distinctId: ctx.user.id,
			properties: {
				prediction: prediction.id,
				outcome: parsedInput.outcome,
				community: prediction.community,
				amount: parsedInput.amount,
			},
		});

		revalidatePath(`/predictions/${prediction.handle}`);
		revalidatePath("/predictions");
		if (prediction.event) {
			revalidatePath(`/events/${prediction.event.handle}`);
		}

		// if (didEarnXP) {
		// 	return {
		// 		earnedXP: prediction.xp,
		// 		totalXP: newUserXP,
		// 	};
		// }
	});
