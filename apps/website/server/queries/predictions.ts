"use server";

import { bets, predictions, outcomes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, sql } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getPrediction = cache(
	async (input: { id: string }) => {
		return db.query.predictions.findFirst({
			where: eq(predictions.id, input.id),
			with: {
				outcomes: true,
			},
		});
	},
	["getPrediction"],
	{ revalidate: 60 * 10 },
);
