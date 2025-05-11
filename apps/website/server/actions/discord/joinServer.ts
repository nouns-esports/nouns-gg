import { z } from "zod";
import { createAction } from "../createAction";
import { env } from "~/env";
import { createFilter } from "../createFilter";

export const joinServer = createAction({
	image: "",
	name: "Join Server",
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

		const server: { name: string } = await serverResponse.json();

		return [
			{ text: "Join the" },
			{ text: server.name, highlight: true },
			{ text: "Discord server" },
		];
	},
	check: async ({ inputs, user }) => {
		"use server";

		if (!user.discord?.subject) return false;

		const response = await fetch(
			`https://discord.com/api/guilds/${inputs.server.id}/members/${user.discord.subject}`,
			{
				headers: {
					Authorization: `Bot ${env.DISCORD_TOKEN}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) return false;

		return true;
	},
	filters: {
		server: createFilter({
			options: {
				id: {
					name: "ID",
					description: "The ID of the server",
					schema: z.string(),
				},
				invite: {
					name: "Invite",
					description: "The invite URL of the server",
					schema: z.string(),
				},
			},
			name: "Server",
			required: true,
		}),
	},
});
