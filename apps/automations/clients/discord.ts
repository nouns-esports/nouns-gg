import { REST } from "discord.js";
import { Client } from "discord.js";
import { env } from "~/env";

export const discordClient = new Client({
	intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
});

await discordClient.login(env.DISCORD_TOKEN);

export const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
