import { z } from "zod";
import { createAction } from "../createAction";
import { neynarClient } from "@/server/clients/neynar";

export const repostPost = createAction({
	image: "",
	name: "Repost Post",
	category: "social",
	generateDescription: async (inputs) => {
		"use server";

		const response = await neynarClient.fetchBulkCasts([inputs.post.hash]);
		const post = response.result.casts[0];

		if (!post) throw new Error("Post not found");

		return [{ text: "Repost" }, { text: inputs.post.label, highlight: true }];
	},

	check: async ({ inputs, user }) => {
		"use server";

		if (!user.farcaster) return false;

		const response = await neynarClient.fetchBulkCasts([inputs.post.hash], { viewerFid: user.farcaster.fid });
		const post = response.result.casts[0];

		if (!post) return false;

		return !!post.viewer_context?.recasted;
	},
	filters: {
		post: {
			options: {
				hash: {
					name: "Post Hash",
					description: "The hash of the post to repost",
					schema: z.string(),
				},
				label: {
					name: "Label",
					description: "The label of the post to repost",
					schema: z.string(),
				},
			},
			name: "Post",
			required: true,
		},
	},
});
