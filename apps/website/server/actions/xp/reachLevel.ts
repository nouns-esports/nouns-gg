import { z } from "zod";
import { createAction } from "../createAction";
import { level } from "@/utils/level";

export const reachLevel = createAction({
	image: "",
	name: "Reach Level",
	category: "xp",
	generateDescription: async (inputs) => {
		"use server";

		return [
			{ text: "Reach level" },
			{ text: inputs.level.value.toString(), highlight: true },
		];
	},
	check: async ({ inputs, user }) => {
		"use server";

		console.log(
			inputs,
			inputs.level.value,
			user.level,
			inputs.level.value > user.level,
		);

		return user.level >= inputs.level.value;
	},
	filters: {
		// TODO: Add community filter
		level: {
			required: true,
			options: {
				value: {
					name: "Level",
					description: "The level to reach",
					schema: z.number(),
				},
			},
			name: "Level",
		},
	},
});
