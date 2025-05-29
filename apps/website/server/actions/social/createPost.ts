import { z } from "zod";
import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { and, arrayContains, eq, sql } from "drizzle-orm";
import { communities } from "~/packages/db/schema/public";
import { createFilter } from "../createFilter";
import { neynarClient } from "@/server/clients/neynar";

export const createPost = createAction({
	image: "",
	name: "Create Post",
	category: "social",
	generateDescription: async (inputs) => {
		"use server";

		const parts = [];

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
			});

			if (!community) throw new Error("Community not found");

			parts.push(
				{ text: "Create a post in " },
				{
					text: community.name,
					href: `/c/${community.handle}`,
					image: community.image,
				},
			);
		} else {
			parts.push({ text: "Create a post" });
		}

		if (inputs.match || inputs.embed) {
			parts.push({ text: "that" });
		}

		let count = 0;

		if (inputs.match) {
			parts.push({ text: "includes" });
			parts.push({ text: inputs.match.label });
			count++;
		}

		if (inputs.embed) {
			parts.push({ text: "links" });
			parts.push({ text: inputs.embed.label, highlight: true });
			count++;
		}

		if (count > 1) {
			const lastPart = parts.pop();
			parts.push({ text: "and" });
			if (lastPart) parts.push(lastPart);
		}

		return parts;
	},
	check: async ({ inputs, user }) => {
		"use server";

		if (!user.farcaster) return false;

		const community = inputs.community
			? await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
			})
			: undefined;

		const response = await neynarClient.fetchCastsForUser(user.farcaster.fid, { limit: 5 });

		for (const post of response.casts) {
			for (const post of response.casts) {
				const matchesCommunity = !community?.parentUrl || post.parent_url === community.parentUrl;
				const matchesText = !inputs.match || (post.text && post.text.match(inputs.match.value));
				const matchesEmbed =
					!inputs.embed ||
					(Array.isArray(post.embeds) &&
						post.embeds.some(
							(e) =>
								typeof e === "object" &&
								"url" in e &&
								typeof e.url === "string" &&
								inputs.embed &&
								e.url.match(inputs.embed.value)
						));

				if (matchesCommunity && matchesText && matchesEmbed) {
					return true;
				}
			}
		}

		return false;
	},
	filters: {
		community: createFilter({
			options: {
				id: {
					name: "ID",
					description: "Community ID",
					schema: z.number(),
				},
			},
			name: "Community",
		}),
		match: createFilter({
			options: {
				value: {
					name: "Value",
					description: "Text or regex to match",
					schema: z.string(),
				},
				label: {
					name: "Label",
					description: "",
					schema: z.string(),
				},
			},
			name: "Match",
		}),
		embed: createFilter({
			options: {
				value: {
					name: "Value",
					description: "URL regex to match",
					schema: z.string(),
				},
				label: {
					name: "Label",
					description: "URL label",
					schema: z.string(),
				},
			},
			name: "Embed",
		}),
	},
});
