import { createPlugin } from "../core/createPlugin";
import { Client } from "discord.js";
import { SnowflakeUtil } from "discord.js";

export function discordPlugin(options: { token: string }) {
	return createPlugin(async ({ generateReply }) => {
		const client = new Client({
			intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
		});

		console.log("Logging in to discord", options.token);
		await client.login(options.token);

		client.on("ready", () => {
			console.log("Discord client ready");
		});

		client.on("messageCreate", async (message) => {
			if (message.author.bot) return;
			if (!client.user) return;

			const mentioned = message.mentions.has(client.user.id);

			const author = message.author.username.split("#")[0];
			const mentions = message.mentions.users
				.filter((user) => user.id !== client.user?.id)
				.map((user) => user.username.split("#")[0]);
			const room = message.channel.id;
			const embeds: string[] = [];

			if (mentioned) {
				let response: string | undefined =
					"Sorry, something went wrong and I couldn't complete your task.";

				try {
					const reply = await generateReply(message.content, {
						id: message.id,
						author,
						room,
						mentions,
						embeds,
					});

					// console.log("Reply: ", reply.text);

					response = reply.text;
				} catch (error) {
					// console.log("Error: ", error);
					if (error instanceof Error) {
						try {
							const errorReply = await generateReply(error.message, {
								id: message.id,
								author,
								room,
								mentions,
								embeds,
							});
							response = errorReply.text;
						} catch (error) {
							if (error instanceof Error) {
								// console.log("Deep Error: ", error);
								response = error.message;
							}
						}
					} else {
						response = "Sorry, an unknown error occurred.";
					}
				}

				// console.log("Response: ", response);

				await message.reply({
					content: response,
					nonce: SnowflakeUtil.generate().toString(),
					enforceNonce: true,
				});
			}
		});

		return {
			client,
		};
	});
}
