import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { visits } from "~/packages/db/schema/public";

export const visitLink = createAction({
	name: "Visit Link",
	schema: z.object({
		url: z.string().url().describe("The link to visit"),
	}),
	check: async ({ user, input }) => {
		let url: URL;

		try {
			url = new URL(input.url);
		} catch (error) {
			return false;
		}

		const visited = await db.primary.query.visits.findFirst({
			where: and(eq(visits.user, user.id), eq(visits.url, url.toString())),
		});

		return !!visited;
	},
});
