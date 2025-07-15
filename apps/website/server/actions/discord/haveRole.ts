import { env } from "~/env";
import { createAction } from "../createAction";
import { z } from "zod";

export const haveRole = createAction({
	name: "Have Role",
	schema: z.object({
		server: z.string().describe("The Discord server ID"),
		role: z.string().describe("The Discord role ID"),
	}),
	check: async ({ input, user }) => {
		const account = user.accounts.find(
			(account) => account.platform === "discord",
		);

		if (!account) return false;

		const memberResponse = await fetch(
			`https://discord.com/api/guilds/${input.server}/members/${account.identifier}`,
			{
				headers: {
					Authorization: `Bot ${env.DISCORD_TOKEN}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!memberResponse.ok) return false;

		const data = (await memberResponse.json()) as { roles: string[] };

		return data.roles.includes(input.role);
	},
});
