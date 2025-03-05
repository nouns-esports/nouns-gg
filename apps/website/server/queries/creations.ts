import { unstable_cache as cache } from "next/cache";
import { desc, eq, like, or } from "drizzle-orm";
import { creations } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

export const getCreation = cache(
	async (input: { id: string }) => {
		return db.query.creations.findFirst({
			where: or(eq(creations.id, input.id), like(creations.id, `${input.id}%`)),
			with: {
				creator: true,
			},
		});
	},
	["getCreation"],
	{ tags: ["getCreation"], revalidate: 60 * 10 },
);

export const getCreations = cache(
	async () => {
		return db.query.creations.findMany({ orderBy: desc(creations.id) });
	},
	["getCreations"],
	{ tags: ["getCreations"], revalidate: 60 * 10 },
);

export const getCreator = cache(
	async (input: { creation: string }) => {
		const creation = await db.query.creations.findFirst({
			where: or(
				eq(creations.id, input.creation),
				like(creations.id, `${input.creation}%`),
			),
			with: {
				creator: true,
			},
			columns: {
				creator: true,
			},
		});

		if (!creation?.creator) {
			return;
		}

		return creation.creator;
	},
	["getCreator"],
	{ tags: ["getCreator"], revalidate: 60 * 10 },
);
