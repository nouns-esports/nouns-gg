import { getAction } from "~/apps/website/server/actions";
import { db } from "..";
import { questActions } from "../schema/public";

const data: Record<
	string,
	Array<{ type: string; inputs: { [key: string]: { [key: string]: any } } }>
> = {
	43: [{ type: "becomeNounsDelegate", inputs: {} }],
	23: [{ type: "becomeLilNounsDelegate", inputs: {} }],
	32: [
		{
			type: "holdNFT",
			inputs: {
				token: {
					address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
					label: "Noun",
				},
			},
		},
	],
	22: [
		{
			type: "holdNFT",
			inputs: {
				token: {
					address: "0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b",
					label: "Lil Noun",
				},
			},
		},
	],
	5: [
		{
			type: "createPost",
			inputs: {
				match: {
					value: "https://nouns.gg/api/frames/rounds/smash-2025/votes/[^s]+",
					label: "Smash 2025 Votes",
				},
				community: {
					id: 7,
				},
			},
		},
	],
	21: [
		{
			type: "createPost",
			inputs: {
				match: {
					value: "https://nouns.gg/rounds/[^/]+?user=.+",
					label: "Round Votes",
				},
				community: {
					id: 7,
				},
			},
		},
		{
			type: "linkFarcaster",
			inputs: {},
		},
	],
	13: [
		{
			type: "followAccount",
			inputs: {
				account: {
					fid: 749097,
				},
			},
		},
		{
			type: "linkFarcaster",
			inputs: {},
		},
	],
	37: [
		{
			type: "followAccount",
			inputs: {
				account: {
					fid: 20265,
				},
			},
		},
		{
			type: "linkFarcaster",
			inputs: {},
		},
	],
	33: [
		{ type: "linkDiscord", inputs: {} },
		{
			type: "joinServer",
			inputs: {
				server: {
					id: "967723007403507742",
				},
			},
		},
	],

	30: [
		{
			type: "createRoundProposal",
			inputs: {
				round: {
					id: 49,
				},
			},
		},
	],
	64: [
		{
			type: "createRoundProposal",
			inputs: {
				round: {
					id: 50,
				},
			},
		},
	],
	65: [
		{
			type: "createRoundProposal",
			inputs: {
				round: {
					id: 51,
				},
			},
		},
	],
	66: [
		{
			type: "createRoundProposal",
			inputs: {
				round: {
					id: 52,
				},
			},
		},
	],
	6: [
		{
			type: "castRoundVote",
			inputs: {
				round: {
					id: 35,
				},
			},
		},
	],
	7: [
		{
			type: "makePrediction",
			inputs: {
				event: {
					id: 10,
				},
			},
		},
	],
	12: [
		{
			type: "signup",
			inputs: {
				event: {
					id: 4,
				},
			},
		},
	],
	14: [
		{
			type: "signup",
			inputs: {
				event: {
					id: 5,
				},
			},
		},
	],
	39: [
		{
			type: "linkDiscord",
			inputs: {},
		},
		{
			type: "linkFarcaster",
			inputs: {},
		},
		{
			type: "linkTwitter",
			inputs: {},
		},
	],
};

await db.primary.transaction(async (tx) => {
	for (const [quest, actionStates] of Object.entries(data)) {
		for (const actionState of actionStates) {
			const action = getAction({ action: actionState.type });

			if (!action) {
				throw new Error(`Action ${actionState.type} not found`);
			}

			const description = await action.generateDescription(actionState.inputs);

			await tx.insert(questActions).values({
				quest: parseInt(quest),
				action: actionState.type,
				description,
				inputs: actionState.inputs,
			});
		}
	}
});
