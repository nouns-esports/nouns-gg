import { z } from "zod";
import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { casts, reactions } from "~/packages/db/schema/farcaster";
import { and, eq } from "drizzle-orm";

export const likePost = createAction({
	image: "",
	name: "Like Post",
	category: "social",
	generateDescription: async (inputs) => {
		"use server";

		const post = await db.primary.query.casts.findFirst({
			where: eq(casts.hash, inputs.post.hash),
		});

		if (!post) throw new Error("Post not found");

		return [{ text: "Like" }, { text: inputs.post.label, highlight: true }];
	},

	check: async ({ inputs, user }) => {
		"use server";

		if (!user.farcaster) return false;

		const post = await db.primary.query.casts.findFirst({
			where: eq(casts.hash, inputs.post.hash),
			with: {
				reactions: {
					where: and(
						eq(reactions.fid, user.farcaster.fid),
						eq(reactions.reactionType, 1),
					),
				},
			},
		});

		if (!post) throw new Error("Post not found");

		return post.reactions.length > 0;
	},
	filters: {
		post: {
			options: {
				hash: {
					name: "Post Hash",
					description: "The hash of the post to like",
					schema: z.string(),
				},
				label: {
					name: "Label",
					description: "The label of the post to like",
					schema: z.string(),
				},
			},
			name: "Post",
			required: true,
		},
	},
});
