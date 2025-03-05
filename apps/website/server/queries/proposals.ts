import { proposals } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

import { and, eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getProposal = cache(
	async (input: { id: number } | { user: string; round: string }) => {
		if ("id" in input) {
			return db.query.proposals.findFirst({
				where: eq(proposals.id, input.id),
				with: {
					round: true,
				},
			});
		}

		if (input.user) {
			return db.query.proposals.findFirst({
				where: and(
					eq(proposals.round, input.round),
					eq(proposals.user, input.user),
				),
				with: {
					round: true,
				},
			});
		}

		throw new Error("You must provide either an id or a user");
	},
	["proposals"],
	{ tags: ["proposals"], revalidate: 60 * 10 },
);
