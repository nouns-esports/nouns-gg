"use server";

import { unstable_cache as cache } from "next/cache";
import { db } from "~/packages/db";
import { nouns, nounsTraits } from "~/packages/db/schema/indexer";
import { count, eq, sql } from "drizzle-orm";

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

export const getTraits = cache(
	async (input: {
		accessory: number;
		body: number;
		head: number;
		glasses: number;
	}) => {
		const traits = await db.pgpool.query.nounsTraits.findMany({
			where: (t, { or, eq }) =>
				or(
					eq(nounsTraits.id, `accessory:${input.accessory}`),
					eq(nounsTraits.id, `body:${input.body}`),
					eq(nounsTraits.id, `head:${input.head}`),
					eq(nounsTraits.id, `glasses:${input.glasses}`),
				),
		});

		const accessory = traits.find((t) => t.type === "accessory");
		const body = traits.find((t) => t.type === "body");
		const head = traits.find((t) => t.type === "head");
		const glasses = traits.find((t) => t.type === "glasses");

		return { accessory, body, head, glasses };
	},
	["getTraits"],
);

export const getTraitCounts = cache(async () => {
	const [counts] = await db.pgpool
		.select({
			accessory: db.pgpool.$count(
				nounsTraits,
				eq(nounsTraits.type, "accessory"),
			),
			body: db.pgpool.$count(nounsTraits, eq(nounsTraits.type, "body")),
			head: db.pgpool.$count(nounsTraits, eq(nounsTraits.type, "head")),
			glasses: db.pgpool.$count(nounsTraits, eq(nounsTraits.type, "glasses")),
		})
		.from(nounsTraits);

	return counts;
}, ["getTraitCounts"]);

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
