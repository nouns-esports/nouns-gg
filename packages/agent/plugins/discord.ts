import { ToolExecutionError } from "ai";
import { createPlugin } from "../core/createPlugin";
import { Client } from "discord.js";

export function discordPlugin(options: { token: string }) {
	return createPlugin(async ({ generateReply }) => {
		const client = new Client({
			intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
		});

		await client.login(options.token);

		client.on("messageCreate", async (message) => {
			if (message.author.bot) return;
			if (!client.user) return;

			const mentioned = message.mentions.has(client.user.id);

			if (mentioned) {
				let response: string | undefined;

				try {
					const reply = await generateReply(message.content, {
						id: message.id,
						author: message.author.username.split("#")[0],
						room: message.channel.id,
						mentions: message.mentions.users.map(
							(user) => user.username.split("#")[0],
						),
						embeds: [],
					});

					response = reply.text;
				} catch (error) {
					if (error instanceof ToolExecutionError) {
						response = error.message;
					} else if (error instanceof Error) {
						response = error.message;
					} else {
						response =
							"Sorry, something went wrong and I couldn't complete your task.";
					}
				}

				console.log("Response: ", response);

				await message.reply(response);
			}
		});

		return {
			client,
		};
	});
}
