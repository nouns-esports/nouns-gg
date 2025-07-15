import { env } from "~/env";
import { createAction } from "../createAction";
import { z } from "zod";

export const joinServer = createAction({
	name: "Join Server",
	schema: z.object({
		server: z.string().describe("The Discord server ID"),
	}),
	check: async ({ input, user }) => {
		const account = user.accounts.find(
			(account) => account.platform === "discord",
		);

		if (!account) return false;

		const response = await fetch(
			`https://discord.com/api/guilds/${input.server}/members/${account.identifier}`,
			{
				headers: {
					Authorization: `Bot ${env.DASH_DISCORD_TOKEN}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) return false;

		return true;
	},
});
