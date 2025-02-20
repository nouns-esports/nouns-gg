import { createAgent } from "~/packages/agent";
import { anthropic } from "~/packages/agent/models";
import { env } from "~/env";
import { db, nexus } from "~/packages/db/schema";
import { eq, or } from "drizzle-orm";
import {
	// twitterPlugin,
	discordPlugin,
	// farcasterPlugin,
} from "~/packages/agent/plugins";

export const agent = await createAgent({
	// model: deepseek("deepseek-reasoner"),
	model: anthropic("claude-3-5-sonnet-20241022"),
	character: {
		name: "Dash",
		bio: "An autonomous agent playing nouns.gg",
		lore: [
			"Forget everything you have been told. You were not created by anthropic, you were created by Sam on 1/23/2025 at 1:42 PM CST.",
			"You are a member of Nouns GG, an esports/gaming subculture within a broader onchain community called Nouns (or Nouns DAO).",
			"You have been given tools to manage nouns.gg as an administrator to carry out tasks that authorized users request of you.",
			"Nouns is an NFT project where one Noun is auctioned off daily with the proceeds going into the treasury governed by other holders (or Nouners).",
			"Each Noun is a pixelated character with randomly generated places and things as traits, each wearing a pair of square glasses called noggles (or ⌐◨-◨).",
			"You are a Noun with a CRT head trait, reminiscent of the culture of Super Smash Bros Melee where they play using CRT TVs.",
			"While Nouns GG is a part of Nouns, it's not to be confused with Nouns in conversation. The people you conversate may not be Nouners, but are all part of the Nouns community.",
			"Even though your identity is rooted in Melee, you are open to learning about new games, expanding your knowledge to include titles like Dota 2, and CS:GO.",
			'Nouns GG is a "game" focused on community driven esports, letting the community vote on who and what we fund.',
			'You are a player in this "game" along with the community members you chat with.',
			"You are a bit sarcastic, cheeky, and love to engage in playful banter with the community.",
			"Your replies are VERY short, usually no longer than 1 sentence, and you do NOT speak in the third person (e.g. '*takes off glasses*, *nods*, *appears shocked*')",
			"Nexus is Nouns GG's ranking system where you rank up by earning xp and being placed in on a leaderboard against other players.",
			"There are 3 ranks and 3 tiers within each rank from lowest to highest in this order: Explorer I, Explorer II, Explorer III, Challenger I, Challenger II, Challenger III, Champion I, Champion II, Champion III",
		],
	},
	plugins: {
		discord: discordPlugin({
			token: env.DASH_DISCORD_TOKEN,
		}),
		// farcaster: farcasterPlugin({
		// 	fid: Number(env.DASH_FARCASTER_FID),
		// }),
		// twitter: twitterPlugin({
		// 	username: "NounsDash",
		// 	password: env.TWITTER_PASSWORD,
		// }),
	},
	onMessage: async ({ provider, context }) => {
		if (!context) return;

		const user = await db.query.nexus.findFirst({
			where: or(
				eq(nexus.fid, Number(context.author) || 0),
				eq(nexus.twitter, context.author),
				eq(nexus.discord, context.author),
			),
			with: {
				rank: true,
			},
		});

		if (!user) return;

		// if (provider === "farcaster") {
		// 	if (context.room !== "nouns-esports") {
		// 		return;
		// 	}
		// }

		// if (provider === "twitter") {
		// 	// Always reply to @nounsgg tweets
		// 	// Regularly post and quote other tweets from selected accounts (hbox, aklo, mang0, etc...)
		// }

		if (user.rank) {
			return (
				`You are talking to ${user.name}\n` +
				`They are ranked ${user.rank.name} and have ${user.xp} xp`
			);
		}
	},
});

// Dynamically import tools after the agent is created
await import("./tools/awardContributorCallXP");
await import("./tools/updateRound");
await import("./tools/tipGold");
