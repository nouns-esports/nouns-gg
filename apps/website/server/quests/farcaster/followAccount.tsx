import { neynarClient } from "@/server/clients/neynar";
import createAction from "../createAction";

export const followAccount = createAction<{ account?: string }>(
	async (actionInputs) => {
		if (!actionInputs.account) {
			throw new Error("Account input missing in action");
		}

		return {
			description: (
				<p>
					Follow <span className="text-red">@{actionInputs.account}</span>
				</p>
			),
			url: `https://warpcast.com/${actionInputs.account}`,
			check: async (user) => {
				if (!actionInputs.account) return false;
				if (!user.farcaster) return false;

				const response = await neynarClient.searchUser(
					actionInputs.account,
					user.farcaster.fid,
					{ limit: 1 },
				);

				if (response.result.users.length === 0) {
					return false;
				}

				if (response.result.users[0]?.username !== actionInputs.account) {
					return false;
				}

				if (!response.result.users[0].viewer_context?.following) return false;

				return true;
			},
		};
	},
);
