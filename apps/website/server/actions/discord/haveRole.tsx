import { z } from "zod";
import { createAction } from "../createAction";
import { env } from "~/env";

export const haveRole = createAction({
	schema: z.object({
		server: z
			.object({
				id: z.string().describe("The server id"),
				name: z.string().describe("The server name"),
			})
			.describe("The server to check for the role in"),
		role: z
			.object({
				id: z.string().describe("The role id"),
				name: z.string().describe("The role name"),
			})
			.describe("The role to check for"),
	}),
	create: async ({ server, role }) => {
		return {
			description: (
				<p>
					Have the <span className="text-red">{role.name}</span> role in{" "}
					<span className="text-red">{server.name}</span>
				</p>
			),
			url: "/discord",
			check: async (user) => {
				if (!user.discord?.subject) return false;

				const memberResponse = await fetch(
					`https://discord.com/api/guilds/${server}/members/${user.discord.subject}`,
					{
						headers: {
							Authorization: `Bot ${env.DISCORD_TOKEN}`,
							"Content-Type": "application/json",
						},
					},
				);

				if (!memberResponse.ok) return false;

				const data: { roles: string[] } = await memberResponse.json();

				if (data.roles.includes(role.id)) return true;

				return false;
			},
		};
	},
});
