import { db } from "~/packages/db";
import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";
import { visits } from "~/packages/db/schema/public";
import { and, eq } from "drizzle-orm";

export const visitLink = createAction({
	image: "",
	name: "Visit Link",
	category: "online",
	generateDescription: async (inputs) => {
		"use server";

		const parts = [];

		if (inputs.link.action) {
			parts.push({
				text: inputs.link.action,
			});
		} else parts.push({ text: "Visit" });

		parts.push({
			text: inputs.link.label,
		});

		return parts;
	},
	check: async ({ user, inputs }) => {
		"use server";

		const visited = await db.primary.query.visits.findFirst({
			where: and(eq(visits.user, user.id), eq(visits.url, inputs.link.url)),
		});

		return !!visited;
	},
	filters: {
		link: createFilter({
			options: {
				url: {
					name: "URL",
					description: "The URL to visit",
					schema: z.string().url(),
				},
				label: {
					name: "Label",
					description: "The label of the url",
					schema: z.string(),
				},
				action: {
					name: "User Action",
					description: "What the user will do at the url",
					schema: z.string().optional(),
				},
			},
			name: "Link",
			required: true,
		}),
	},
});
