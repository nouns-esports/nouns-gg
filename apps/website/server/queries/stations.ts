"use server";

import { stations } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getStation = cache(
	async (input: { id: number }) => {
		return db.query.stations.findFirst({
			where: eq(stations.id, input.id),
			with: {
				event: true,
			},
		});
	},
	["getStation"],
	{ revalidate: 60 * 10 },
);

export const getStations = cache(
	async (input: { event: string }) => {
		return db.query.stations.findMany({
			where: eq(stations.event, input.event),
		});
	},
	["getStations"],
	{ revalidate: 60 * 10 },
);
