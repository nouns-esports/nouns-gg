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

		let url: URL;

		try {
			url = new URL(inputs.link.url);
		} catch (error) {
			throw new Error(`Invalid URL: ${inputs.link.url}`);
		}

		parts.push({
			text: inputs.link.label,
			href: `/visit?url=${url.toString()}`,
		});

		return parts;
	},
	check: async ({ user, inputs }) => {
		"use server";

		let url: URL;

		try {
			url = new URL(inputs.link.url);
		} catch (error) {
			return false;
		}

		const visited = await db.primary.query.visits.findFirst({
			where: and(eq(visits.user, user.id), eq(visits.url, url.toString())),
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
