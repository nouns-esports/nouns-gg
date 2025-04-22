import { z } from "zod";
import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { sql } from "drizzle-orm";
import { nexus } from "~/packages/db/schema/public";

export const reachPercentile = createAction({
	image: "",
	name: "Reach Percentile",
	category: "xp",
	generateDescription: async (inputs) => {
		"use server";

		return [
			{ text: "Reach top" },
			{ text: inputs.percentile.value.toString(), highlight: true },
		];
	},
	check: async ({ inputs, user }) => {
		"use server";

		if (!user.nexus) return false;

		const [{ rank, total }] = await db.pgpool
			.select({
				rank: sql<number>`rank() over (order by ${nexus.xp} desc)`.as("rank"),
				total: sql<number>`count(*)`.as("total"),
			})
			.from(nexus);

		const percentile = (rank / total) * 100;

		return percentile < inputs.percentile.value;
	},
	filters: {
		// TODO: Add community filter
		percentile: {
			required: true,
			options: {
				value: {
					name: "Percentile",
					description: "The percentile to reach",
					schema: z.number(),
				},
			},
			name: "Percentile",
		},
	},
});
