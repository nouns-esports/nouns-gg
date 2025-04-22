import { createAction } from "../createAction";

export const linkX = createAction({
	image: "",
	name: "Link X",
	category: "account",
	generateDescription: async () => {
		"use server";

		return [
			{ text: "Link an X account to" },
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
