"use server";

import { unstable_cache as cache } from "next/cache";
import { db } from "~/packages/db";
import { nouns, nounsTraits } from "~/packages/db/schema/indexer";

export const getTrait = cache(
	async (input: {
		type: "accessory" | "body" | "head" | "glasses";
		index: number;
	}) => {
		return db.pgpool.query.nounsTraits.findFirst({
			where: (t, { and, eq }) =>
				and(
					eq(nounsTraits.type, input.type),
					eq(nounsTraits.index, input.index),
				),
		});
	},
	["getTrait"],
);

export const getNoun = cache(
	async (input: {
		id?: bigint;
	}) => {
		return db.pgpool.query.nouns.findFirst({
			where: input.id ? (t, { eq }) => eq(nouns.id, input.id!) : undefined,
			orderBy: (t, { desc }) => [desc(t.id)],
			with: {
				accessory: true,
				body: true,
				head: true,
				glasses: true,
			},
		});
	},
);
