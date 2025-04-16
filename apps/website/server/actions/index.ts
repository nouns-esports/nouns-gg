import type { createAction } from "./createAction";

// Account
import { linkDiscord } from "./account/linkDiscord";
import { linkEmail } from "./account/linkEmail";
import { linkFarcaster } from "./account/linkFarcaster";
import { linkWallet } from "./account/linkWallet";
import { linkX } from "./account/linkX";

// Discord
import { accountAge } from "./discord/accountAge";
import { attendCall } from "./discord/attendCall";
import { haveRole } from "./discord/haveRole";

// Events
import { signup } from "./events/signup";

// Farcaster
import { cast } from "./farcaster/cast";
import { followAccount } from "./farcaster/followAccount";

// Lil Nouns
import { becomeDelegate as becomeLilNounsDelegate } from "./lilnouns/becomeDelegate";

// Nouns
import { becomeDelegate as becomeNounsDelegate } from "./nouns/becomeDelegate";

// XP
import { reachLevel } from "./xp/reachLevel";
import { reachPercentile } from "./xp/reachPercentile";

const actions = {
	account: {
		linkDiscord,
		linkEmail,
		linkFarcaster,
		linkWallet,
		linkX,
	},
	discord: {
		accountAge,
		attendCall,
		haveRole,
	},
	events: {
		signup,
	},
	farcaster: {
		cast,
		followAccount,
	},
	lilnouns: {
		becomeLilNounsDelegate,
	},
	nouns: {
		becomeNounsDelegate,
	},
	xp: {
		reachLevel,
		reachPercentile,
	},
};

export function getAction(props: {
	action: string;
}): ReturnType<typeof createAction> | undefined {
	for (const category in actions) {
		const categoryActions = actions[category as keyof typeof actions];
		if (props.action in categoryActions) {
			return categoryActions[props.action as keyof typeof categoryActions];
		}
	}
}
