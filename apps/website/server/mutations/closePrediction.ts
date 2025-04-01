"use server";

import { db } from "~/packages/db";
import { predictions } from "~/packages/db/schema/public";
import { onlyUser } from ".";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const closePrediction = onlyUser
	.schema(
		z.object({
			prediction: z.number(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const prediction = await db.primary.query.predictions.findFirst({
			where: (t, { eq }) => eq(predictions.id, parsedInput.prediction),
		});

		if (!prediction) {
			throw new Error("Prediction not found");
		}

		if (prediction.closed) {
			throw new Error("Prediction is already closed");
		}

		if (prediction.resolved) {
			throw new Error("Prediction is resolved");
		}

		await db.primary
			.update(predictions)
			.set({ closed: true })
			.where(eq(predictions.id, parsedInput.prediction));
	});
