import { z } from "zod";
import { neynarClient } from "../../clients/neynar";
import { createAction } from "../createAction";

export const followAccount = createAction({
	name: "Follow Account",
	schema: z.object({
		fid: z.number().describe("The Farcaster account id to follow"),
	}),
	check: async ({ user, input }) => {
		const account = user.accounts.find(
			(account) => account.platform === "farcaster",
		);

		if (!account) return false;

		const response = await neynarClient.fetchBulkUsers([input.fid], {
			viewerFid: Number(account.identifier),
		});

		const followAccount = response.users[0];

		if (!followAccount) return false;

		return !!followAccount.viewer_context?.following;
	},
});
