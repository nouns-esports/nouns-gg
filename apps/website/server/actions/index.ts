import type { createAction } from "./createAction";

import { linkDiscord } from "./account/linkDiscord";
import { linkEmail } from "./account/linkEmail";
import { linkFarcaster } from "./account/linkFarcaster";
import { linkWallet } from "./account/linkWallet";
import { linkTwitter } from "./account/linkTwitter";
import { haveRole } from "./discord/haveRole";
import { joinServer } from "./discord/joinServer";
import { signup } from "./events/signup";
import { becomeLilNounsDelegate } from "./lilnouns/becomeDelegate";
import { becomeNounsDelegate } from "./nouns/becomeDelegate";
import { bidAuction } from "./nouns/bidAuction";
import { castNounsVote } from "./nouns/castVote";
import { createNounsProposal } from "./nouns/createProposal";
import { visitLink } from "./online/visitLink";
import { makePrediction } from "./predictions/makePrediction";
import { winPrediction } from "./predictions/winPrediction";
import { completeQuest } from "./quests/completeQuest";
import { castRoundVote } from "./rounds/castVote";
import { createRoundProposal } from "./rounds/createProposal";
import { recieveVotes } from "./rounds/recieveVotes";
import { createPost } from "./social/createPost";
import { likePost } from "./social/likePost";
import { repostPost } from "./social/repostPost";
import { reachPercentile } from "./xp/reachPercentile";
import { holdNFT } from "./onchain/holdNFT";
import { followAccount } from "./social/followAccount";
import { graduateTraits } from "./noundry/graduateTraits";
import { submitTraits } from "./noundry/submitTraits";
import { lilnounsSnapshot } from "./lilnouns/lilnounsSnapshot";

const actions = {
	// Account
	linkDiscord,
	linkEmail,
	linkFarcaster,
	linkWallet,
	linkTwitter,

	// Discord
	haveRole,
	joinServer,

	// Events
	signup,

	// Lil Nouns
	becomeLilNounsDelegate,
	lilnounsSnapshot,

	// Nouns
	becomeNounsDelegate,
	bidAuction,
	castNounsVote,
	createNounsProposal,

	// Online
	visitLink,

	// Onchain
	holdNFT,

	// Predictions
	makePrediction,
	winPrediction,

	// Quests
	completeQuest,

	// Rounds
	castRoundVote,
	createRoundProposal,
	recieveVotes,

	// Social
	createPost,
	likePost,
	repostPost,
	followAccount,

	// XP
	reachPercentile,

	// Noundry
	graduateTraits,
	submitTraits,
};

export function getAction(props: {
	action: string;
}) {
	return actions[props.action as keyof typeof actions] as
		| ReturnType<typeof createAction>
		| undefined;
}

export function getActions(props: {
	category: string;
}) {
	return Object.values(actions).filter(
		(action) => action.category === props.category,
	) as ReturnType<typeof createAction>[];
}
