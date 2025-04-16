import { z } from "zod";
import { createAction } from "../createAction";

export const accountAge = createAction({
	schema: z.object({
		since: z.date().describe("The account must be older than this date"),
	}),
	create: async ({ since }) => {
		return {
			description: <p>Link your Discord account</p>,
			url: "/user",
			check: async (user) => {
				if (!user.discord) return false;

				const creationDate = new Date(
					Number((BigInt(user.discord.subject) >> 22n) + 1420070400000n),
				);

				if (creationDate.getTime() > since.getTime()) return false;

				return true;
			},
		};
	},
});
