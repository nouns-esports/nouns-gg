import { createAction } from "../createAction";

export const linkFarcaster = createAction({
	image: "",
	name: "Link Farcaster",
	category: "account",
	generateDescription: async () => {
		"use server";

		return [
			{ text: "Link a Farcaster account to" },
			{ text: "Your Profile", href: "/user" },
		];
	},
	check: async ({ user }) => {
		"use server";

		if (!user.farcaster) return false;

		return true;
	},
	filters: {},
});
