import { z } from "zod";
import { createAction } from "../createAction";
import { neynarClient } from "@/server/clients/neynar";

export const followAccount = createAction({
	image: "",
	name: "Follow Account",
	category: "social",
	generateDescription: async (inputs) => {
		"use server";

		const response = await neynarClient.fetchBulkUsers([inputs.account.fid]);
		const account = response.users[0];

		if (!account) throw new Error("Account not found");
		if (!account.username) throw new Error("Account has no username");

		return [
			{ text: "Follow" },
			{
				text: `@${account.username}`,
				href: `https://farcaster.xyz/${account.username}`,
			},
		];
	},
	check: async ({ inputs, user }) => {
		"use server";

		if (!user.farcaster) return false;

		const response = await neynarClient.fetchBulkUsers([inputs.account.fid], { viewerFid: user.farcaster.fid });
		const account = response.users[0];

		if (!account) return false;

		return !!account.viewer_context?.following;
	},
	filters: {
		account: {
			required: true,
			options: {
				fid: {
					name: "Farcaster ID",
					description: "The Farcaster ID of the account to follow",
					schema: z.number(),
				},
			},
			name: "Account",
		},
	},
});
