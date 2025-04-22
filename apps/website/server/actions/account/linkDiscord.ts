import { createAction } from "../createAction";
import { createFilter } from "../createFilter";
import { z } from "zod";

export const linkDiscord = createAction({
	image: "",
	name: "Link Discord",
	category: "account",
	generateDescription: async (inputs) => {
		"use server";
		const parts = [];

		parts.push({ text: "Link a Discord account to" });
		parts.push({ text: "Your Profile", href: "/user" });

		if (inputs.age !== undefined) {
			parts.push({ text: "that is older than" });
			parts.push({
				text: `${inputs.age.months} months`,
				highlight: true,
			});
		}

		return parts;
	},
	check: async ({ user, inputs }) => {
		"use server";
		if (!user.discord) return false;

		if (inputs.age !== undefined) {
			const creationDate = new Date(
				Number((BigInt(user.discord.subject) >> 22n) + 1420070400000n),
			);

			const now = new Date();
			const monthsAgo = new Date(
				now.getTime() - inputs.age.months * 30 * 24 * 60 * 60 * 1000,
			);

			if (creationDate < monthsAgo) return false;
		}

		return true;
	},
	filters: {
		age: createFilter({
			options: {
				months: {
					name: "Months",
					description: "Minimum account age in months",
					schema: z.number(),
				},
			},
			name: "Account Age",
		}),
	},
});
