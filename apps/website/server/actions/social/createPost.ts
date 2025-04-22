import { z } from "zod";
import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { and, arrayContains, eq, sql } from "drizzle-orm";
import { communities } from "~/packages/db/schema/public";
import { casts, profiles } from "~/packages/db/schema/farcaster";
import { createFilter } from "../createFilter";

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

			parts.push({
				text: `Create a post in ${community.name}`,
				href: `/c/${community.handle}`,
				image: community.image,
			});
		} else {
			parts.push({ text: "Create a post" });
		}

		if (inputs.match || inputs.mention || inputs.embed) {
			parts.push({ text: "that" });
		}

		let count = 0;

		if (inputs.mention) {
			parts.push({ text: "mentions" });

			const mention = await db.primary.query.profiles.findFirst({
				where: eq(profiles.fid, inputs.mention.fid),
			});

			if (!mention) throw new Error("Mention profile not found");
			if (!mention.username) throw new Error("Mention profile has no username");

			parts.push({
				text: mention.username,
				href: `/user/${mention.username}`,
				image: mention.pfpUrl ?? undefined,
			});
			count++;
		}

		if (inputs.match) {
			parts.push({ text: "includes" });
			parts.push({ text: inputs.match.value });
			count++;
		}

		if (inputs.embed) {
			parts.push({ text: "links" });
			parts.push({ text: inputs.embed.label, href: inputs.embed.url });
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

		const post = await db.primary.query.casts.findFirst({
			where: and(
				eq(casts.fid, user.farcaster.fid),
				community?.channel
					? eq(casts.rootParentUrl, community.channel)
					: undefined,
				inputs.match ? sql`${casts.text} ~ ${inputs.match.value}` : undefined,
				inputs.mention
					? arrayContains(casts.mentions, [inputs.mention.fid])
					: undefined,
				inputs.embed ? sql`${inputs.embed} ~ ANY(${casts.embeds})` : undefined,
			),
		});

		return !!post;
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
		mention: createFilter({
			options: {
				fid: {
					name: "Farcaster ID",
					description: "The user's Farcaster ID",
					schema: z.number(),
				},
			},
			name: "Mention",
		}),
		embed: createFilter({
			options: {
				url: {
					name: "URL",
					description: "URL to embed",
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
