import { privyClient } from "../../clients/privy";
import { createAction } from "../createAction";
import { z } from "zod";

export const linkWallet = createAction({
	name: "linkWallet",
	schema: z.object({
		provider: z.string().nullable().describe("The wallet provider"),
	}),
	check: async ({ input, user }) => {
		const privyUser = await privyClient.getUserById(user.id);

		if (!privyUser) return false;

		if (input.provider) {
			for (const account of privyUser.linkedAccounts) {
				if (
					account.type === "wallet" &&
					account.walletClientType?.toLowerCase() ===
						input.provider.toLowerCase()
				) {
					return true;
				}
			}

			return false;
		}

		const hasWallet = privyUser.linkedAccounts.some(
			(account) => account.type === "wallet",
		);

		return hasWallet;
	},
});
