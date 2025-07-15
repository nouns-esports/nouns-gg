import { z } from "zod";
import { neynarClient } from "../../clients/neynar";
import { createAction } from "../createAction";

export const likePost = createAction({
	name: "Like Post",
	schema: z.object({
		post: z.string().describe("The hash of the post to like"),
	}),
	check: async ({ user, input }) => {
		const account = user.accounts.find(
			(account) => account.platform === "farcaster",
		);

		if (!account) return false;

		const response = await neynarClient.fetchBulkCasts([input.post], {
			viewerFid: Number(account.identifier),
		});
		const post = response.result.casts[0];

		if (!post) return false;

		return !!post.viewer_context?.liked;
	},
});
