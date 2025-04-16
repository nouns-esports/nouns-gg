import { z } from "zod";
import { createAction } from "../createAction";
import { env } from "~/env";

export const joinServer = createAction({
	schema: z.object({
		server: z
			.object({
				id: z.string().describe("The server id"),
				name: z.string().describe("The server name"),
			})
			.describe("The server to join"),
	}),
	create: async ({ server }) => {
		return {
			description: (
				<p>
					Join the <span className="text-red">{server.name}</span> server
				</p>
			),
			url: "/discord",
			check: async (user) => {
				if (!user.discord?.subject) return false;

				const response = await fetch(
					`https://discord.com/api/guilds/${server}/members/${user.discord.subject}`,
					{
						headers: {
							Authorization: `Bot ${env.DISCORD_TOKEN}`,
							"Content-Type": "application/json",
						},
					},
				);

				if (!response.ok) return true;

				return false;
			},
		};
	},
});
