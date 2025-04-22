import { z } from "zod";
import { createAction } from "../createAction";
import { env } from "~/env";
import { createFilter } from "../createFilter";

export const haveRole = createAction({
	image: "",
	name: "Have Role",
	category: "discord",
	generateDescription: async (inputs) => {
		"use server";

		const serverResponse = await fetch(
			`https://discord.com/api/guilds/${inputs.server.id}`,
			{
				headers: {
					Authorization: `Bot ${env.DISCORD_TOKEN}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!serverResponse.ok) throw new Error("Failed to fetch server");

		const server: { name: string; roles: { id: string; name: string }[] } =
			await serverResponse.json();

		const role = server.roles.find((role) => role.id === inputs.role.id);

		if (!role) throw new Error("Role not found");

		return [
			{ text: "Have the" },
			{ text: role.name, highlight: true },
			{ text: "role in the" },
			{ text: server.name, highlight: true },
			{ text: "Discord server" },
		];
	},
	check: async ({ inputs, user }) => {
		"use server";

		if (!user.discord?.subject) return false;

		const memberResponse = await fetch(
			`https://discord.com/api/guilds/${inputs.server.id}/members/${user.discord.subject}`,
			{
				headers: {
					Authorization: `Bot ${env.DISCORD_TOKEN}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!memberResponse.ok) return false;

		const data: { roles: string[] } = await memberResponse.json();

		return data.roles.includes(inputs.role.id);
	},
	filters: {
		server: createFilter({
			options: {
				id: {
					name: "ID",
					description: "The ID of the server",
					schema: z.string(),
				},
			},
			name: "Server",
			required: true,
		}),
		role: createFilter({
			options: {
				id: {
					name: "ID",
					description: "The ID of the role",
					schema: z.string(),
				},
			},
			name: "Role",
			required: true,
		}),
	},
});
