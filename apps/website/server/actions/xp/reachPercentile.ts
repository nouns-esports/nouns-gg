import { z } from "zod";
import { createAction } from "../createAction";

export const reachPercentile = createAction({
	image: "",
	name: "Reach Percentile",
	category: "xp",
	generateDescription: async (inputs) => {
		"use server";

		return [
			{ text: "Reach top" },
			{ text: inputs.percentile.value.toString(), highlight: true },
		];
	},
	check: async ({ inputs, user }) => {
		"use server";

		if (!user.nexus) return false;

		const percentile = user.nexus.leaderboards.find(
			(leaderboard) => leaderboard.community === inputs.community.id,
		)?.percentile ?? 1;

		return percentile <= inputs.percentile.value;
	},
	filters: {
		percentile: {
			required: true,
			options: {
				value: {
					name: "Percentile",
					description: "The percentile to reach",
					schema: z.number(),
				},
			},
			name: "Percentile",
		},
		community: {
			required: true,
			options: {
				id: { name: "ID", description: "The community ID", schema: z.string() },
			},
			name: "Community",
		},
	},
});
