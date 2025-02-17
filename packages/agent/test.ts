// @ts-nocheck

import { createAgent } from "~/packages/agent";
import { anthropic } from "~/packages/agent/models";

// Runs a server and a frontend admin panel where you can chat directly, feed it custom knowledge, view statistics / real-time activity across all platforms
const agent = await createAgent({
	model: anthropic("claude-3-haiku-20240307"),
	character: {
		name: "Agent",
		bio: "An autonomous agent",
		lore: ["You are an autonomous agent"],
	},
	plugins: {
		discord: discordPlugin({
			token: env.DISCORD_TOKEN,
		}),
		farcaster: farcasterPlugin({
			fid: 123456,
		}),
		ethereum: ethereumPlugin({
			privateKey: env.ETHEREUM_PRIVATE_KEY,
			chains: [mainnet, base],
			contracts: {
				NounsDAOGovernor: {
					abi: NounsDAOGovernorABI as const,
					deployments: {
						mainnet: {
							address: "0x0000000000000000000000000000000000000000",
						},
						zora: {
							// TYPE ERROR: zora not in config.chains (above)
							address: "0x0000000000000000000000000000000000000000",
						},
					},
				},
			},
		}),
	},
	// Conversation history, custom knowledge, scheduled tasks, etc...
	memory: pgVector({
		url: env.DATABASE_URL,
	}),
	// Runs inside of generateReply
	middleware: async ({ provider, context }) => {
		let user: User;

		// the key of plugins property in createAgent config
		switch (provider) {
			case "discord": {
				user = await db.query.users.findFirst({
					where: eq(users.discord, context.author.id),
				});
				break;
			}
			case "farcaster": {
				user = await db.query.users.findFirst({
					where: eq(users.fid, Number(context.author.id)),
				});
				break;
			}
		}

		// Only accept messages from verified users
		if (!user) return;

		return "Extra context";
	},
});

const { client } = agent.plugins.discord;
// Dependednt on memory
agent.scheduleTask();
agent.addTool();
// Dependednt on memory
agent.addMemory();

// Should we combine these two? Theoretically, we could make author, text, room, mentions, embeds, etc... optional context params in generateReply
agent.generateReply();
agent.processMessage();

// Endpoint is scoped to /agent/some-endpoint (expose hono catch all route for endpoints created after server is running)
agent.server.get("/some-endpoint");

// Returned by createAgent and passed into the createPlugin callback - maybe call this something different?
type Agent = {
	scheduleTask: () => void;
	addTool: () => void;
	addMemory: () => void;
	generateReply: () => void;
	processMessage: () => void;
	server: {
		get: (path: string) => void;
	};
};

function DiscordPlugin(config: { token: string }) {
	return createPlugin(
		async ({ server, processMessage, addTool, scheduleTask }) => {
			const client = new DiscordClient({
				intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
			});

			await client.login(config.token);

			client.on("messageCreate", async (message) => {
				if (message.author.bot) return;

				const reply = await processMessage({
					// Discord message id
					id: message.id,
					text: message.content,
					// Discord user id
					author: message.author.id,
					// Discord channel id
					room: message.channel.id,
					// Array of Discord user ids
					mentions: message.mentions.users.map((user) => user.id),
					// Links (website, images, videos, frames, quoted posts, etc...)
					// Each gets fetched and their metadata is fed into the reply context
					embeds: message.attachments.map((attachment) => attachment.url),
				});

				await message.reply(reply.text);
			});

			return {
				client,
			};
		},
	);
}

function FarcasterPlugin(config: { fid: number }) {
	return createPlugin(async ({ server, processMessage }) => {
		// Endpoint is scoped to /plugins/farcaster/neynar-webhook
		server.post("/neynar-webhook", async (req) => {
			const { text, author, mentions, embeds, channel, hash } = verifyWebhook(
				await req.json(),
			);

			if (author.fid === config.fid) return;

			// Saves conversation to memory and local cache, fetches previous message context
			// Returns a reply with toolCalls, steps, etc...
			const reply = await processMessage({
				id: hash,
				text,
				author: {
					id: author.fid.toString(),
					name: author.display_name,
				},
				room: channel.id,
				mentions: mentions.map((mention) => mention.fid.toString()),
				embeds: embeds.map((embed) => embed.url),
			});

			await cast({
				text: reply.text,
				parent_url: hash,
			});
		});
	});
}

function EthereumPlugin(config: {
	privateKey: string;
	contracts: Record<
		string,
		{ abi: any; deployments: Record<string, { address: string }> }
	>;
}) {
	return createPlugin(async ({ server, generateReply, addTool }) => {
		const publicClients = Object.fromEntries(
			Object.entries(config.contracts).map(([contract, { deployments }]) => [
				contract,
				createPublicClient({
					chain: mainnet,
					transport: http(),
				}),
			]),
		);

		addTool({
			name: "Block Number",
			description: "Get the current block number",
			parameters: z.object({
				chain: z.string().describe("The chain to get the block number for"),
			}),
			execute: async ({ chain }) => ({
				blockNumber: await publicClients[chain].getBlockNumber(),
			}),
		});

		return {
			publicClients,
		};
	});
}
