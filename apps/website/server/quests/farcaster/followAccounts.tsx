import { neynarClient } from "@/server/clients/neynar";
import createAction from "../createAction";

export const followAccounts = createAction<{ count?: number }>(
	async (actionInputs) => {
		if (!actionInputs.count) {
			throw new Error("Count input missing in action");
		}

		return {
			description: <p>Follow {actionInputs.count} accounts</p>,
			url: "https://warpcast.com/sams/pack/Nouns-Esports-0dts8v",
			check: async (user) => {
				if (!actionInputs.count) return false;
				if (!user.farcaster) return false;

				const response = await neynarClient.fetchBulkUsers([
					user.farcaster.fid,
				]);

				if (response?.users?.[0].following_count < actionInputs.count) {
					return false;
				}

				return true;
			},
		};
	},
);
