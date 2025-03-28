import { quests, xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, asc, desc, eq, gte, isNull, lte } from "drizzle-orm";
import {
	unstable_cache as cache,
	unstable_noStore as noStore,
} from "next/cache";
import { linkFarcaster } from "@/server/quests/farcaster/linkFarcaster";
import type createAction from "../quests/createAction";
import { castInChannel } from "../quests/farcaster/castInChannel";
import { followAccount } from "../quests/farcaster/followAccount";
import { followChannel } from "../quests/farcaster/followChannel";
import { attendCall } from "../quests/discord/attendCall";
import { joinServer } from "../quests/discord/joinServer";
import { linkDiscord } from "../quests/discord/linkDiscord";
import { linkWallet } from "../quests/onchain/linkWallet";
import { linkTwitter } from "../quests/twitter/linkTwitter";
import { mintERC1155 } from "../quests/zora/mintERC1155";
import { visitLink } from "../quests/online/visitLink";
import { placeTrade } from "../quests/matcha/placeTrade";
import { claimAchievement } from "../quests/achievements/claimAchievement";
import { castVote } from "../quests/rounds/castVote";
import { makePrediction } from "../quests/predictions/makePrediction";
import { signup } from "../quests/events/signup";
import { holdERC721 } from "../quests/onchain/holdERC721";
import { becomeDelegate } from "../quests/onchain/becomeDelegate";
import { followAccounts } from "../quests/farcaster/followAccounts";
import { createProposal } from "../quests/rounds/createProposal";

export const actions: Record<string, ReturnType<typeof createAction>> = {
	// Discord
	attendCall,
	joinServer,
	linkDiscord,

	// Twitter
	linkTwitter,

	// Farcaster
	linkFarcaster,
	castInChannel,
	followAccount,
	followChannel,
	followAccounts,

	// Online
	visitLink,

	// Onchain
	linkWallet,

	// Zora
	mintERC1155,

	// Matcha
	placeTrade,

	// Achievements
	claimAchievement,

	// Rounds
	castVote,
	createProposal,
	// Predictions
	makePrediction,

	// Events
	signup,

	// Onchain
	holdERC721,
	becomeDelegate,
};

export async function getAction(input: {
	quest: string;
	action: number;
	user?: string;
}) {
	noStore();

	const quest = await db.pgpool.query.quests.findFirst({
		where: eq(quests.id, input.quest),
		with: {
			completed: input.user
				? {
						where: eq(xp.user, input.user),
						limit: 1,
						columns: { id: true },
					}
				: undefined,
		},
	});

	if (!quest) return;

	const action = quest.actions[input.action];
	const actionInputs = quest.actionInputs[input.action] ?? {};

	return actions[action](actionInputs);
}

export const getQuests = cache(
	async (input: { limit?: number; user?: string; event?: string }) => {
		return db.pgpool.query.quests.findMany({
			limit: input.limit,
			where: and(
				eq(quests.active, true),
				input.event ? eq(quests.event, input.event) : isNull(quests.event),
			),
			orderBy: [desc(quests.featured), desc(quests.createdAt)],
			with: {
				community: true,
				completed: input.user
					? {
							where: eq(xp.user, input.user),
							limit: 1,
						}
					: undefined,
			},
		});
	},
	["getQuests"],
	{ tags: ["getQuests"], revalidate: 60 * 10 },
);

export const getQuest = cache(
	async (input: { id: string; user?: string }) => {
		return db.pgpool.query.quests.findFirst({
			where: eq(quests.id, input.id),
			with: {
				completed: input.user
					? {
							where: eq(xp.user, input.user),
							limit: 1,
						}
					: undefined,
				event: true,
			},
		});
	},
	["getQuest"],
	{ tags: ["getQuest"], revalidate: 60 * 10 },
);
