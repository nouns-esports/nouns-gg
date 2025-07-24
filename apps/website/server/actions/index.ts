import type { createAction } from "./createAction";

import { linkDiscord } from "./account/linkDiscord";
import { linkEmail } from "./account/linkEmail";
import { linkFarcaster } from "./account/linkFarcaster";
import { linkWallet } from "./account/linkWallet";
import { linkTwitter } from "./account/linkTwitter";
import { haveRole } from "./discord/haveRole";
import { joinServer } from "./discord/joinServer";
import { registerEvent } from "./events/registerEvent";
import { lilnounsVoter } from "./lilnouns/lilnounsVoter";
import { nounsVoter } from "./nouns/nounsVoter";
import { visitLink } from "./online/visitLink";
import { makePrediction } from "./predictions/makePrediction";
import { castVote } from "./rounds/castVote";
import { createProposal } from "./rounds/createProposal";
import { createPost } from "./social/createPost";
import { likePost } from "./social/likePost";
import { repostPost } from "./social/repostPost";
import { reachPercentile } from "./xp/reachPercentile";
import { holdERC721 } from "./ethereum/holdERC721";
import { followAccount } from "./social/followAccount";
import { graduateTraits } from "./noundry/graduateTraits";
import { submitTraits } from "./noundry/submitTraits";
import { purchaseItem } from "./shop/purchaseItem";
import { leaderboardPosition } from "./xp/leaderboardPosition";
import { holdERC20 } from "./ethereum/holdERC20";
import { holdERC1155 } from "./ethereum/holdERC1155";
import { nounishVoter } from "./nouns/nounishVoter";
import { gnarsVoter } from "./gnars/gnarsVoter";

const actions: Record<
	string,
	Record<string, ReturnType<typeof createAction<any>>>
> = {
	dash: {
		linkDiscord,
		linkEmail,
		linkFarcaster,
		linkWallet,
		linkTwitter,
		visitLink,
		reachPercentile,
		leaderboardPosition,
	},
	events: { registerEvent },
	rounds: { castVote, createProposal },
	predictions: { makePrediction },
	raffles: {},
	quests: {},
	shop: { purchaseItem },
	discord: {
		haveRole,
		joinServer,
	},
	lilnouns: {
		lilnounsVoter,
	},
	nouns: {
		nounsVoter,
		nounishVoter,
	},
	gnars: {
		gnarsVoter,
	},
	farcaster: {
		createPost,
		likePost,
		repostPost,
		followAccount,
	},
	ethereum: {
		holdERC721,
		holdERC20,
		holdERC1155,
	},
	noundry: {
		graduateTraits,
		submitTraits,
	},
};

export function getAction(input: { action: string; plugin: string }) {
	return actions[input.plugin][input.action];
}
