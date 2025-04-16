import { z } from "zod";
import { createAction } from "../createAction";

export const linkWallet = createAction({
	schema: z.object({
		type: z
			.enum(["rainbow", "coinbase_wallet"])
			.optional()
			.describe("The client type to link"),
	}),
	create: async ({ type }) => {
		return {
			description: (
				<p>
					{
						{
							any: "Link an Ethereum wallet",
							rainbow: "Link a Rainbow wallet",
							coinbase_wallet: "Link a Coinbase Smart Wallet",
						}[type ?? "any"]
					}
				</p>
			),
			url: type === "rainbow" ? "/rainbow" : "/user",
			check: async (user) => {
				if (user.wallets.length === 0) return false;

				if (type === "rainbow") {
					return user.wallets.some(
						(wallet) => wallet.walletClientType === "rainbow",
					);
				}

				if (type === "coinbase_wallet") {
					return user.wallets.some(
						(wallet) => wallet.walletClientType === "coinbase_wallet",
					);
				}

				return true;
			},
		};
	},
});
