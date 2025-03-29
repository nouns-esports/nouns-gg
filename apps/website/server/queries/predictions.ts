"use server";

import { bets, predictions, outcomes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, sql } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getPrediction = cache(
	async (input: { handle: string }) => {
		return db.pgpool.query.predictions.findFirst({
			where: eq(predictions.handle, input.handle),
			with: {
				outcomes: true,
			},
		});
	},
	["getPrediction"],
	{ revalidate: 60 * 10 },
);
