import { createAction } from "../createAction";

export const linkTwitter = createAction({
	image: "",
	name: "Link Twitter",
	category: "account",
	generateDescription: async () => {
		"use server";

		return [
			{ text: "Link a Twitter account to" },
			{ text: "Your Profile", href: "/user" },
		];
	},
	check: async ({ user }) => {
		"use server";

		if (!user.twitter) return false;

		return true;
	},
	filters: {},
});
