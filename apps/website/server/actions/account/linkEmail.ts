import { createAction } from "../createAction";

export const linkEmail = createAction({
	image: "",
	name: "Link Email",
	category: "account",
	generateDescription: async () => {
		"use server";

		return [
			{ text: "Link an email to" },
			{ text: "Your Profile", href: "/user" },
		];
	},
	check: async ({ user }) => {
		"use server";

		if (!user.email) return false;

		return true;
	},
	filters: {},
});
