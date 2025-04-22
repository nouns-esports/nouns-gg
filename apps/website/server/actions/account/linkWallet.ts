import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";

export const linkWallet = createAction({
	image: "",
	name: "Link Wallet",
	category: "account",
	generateDescription: async (inputs) => {
		"use server";

		const parts = [];

		switch (inputs.provider?.type) {
			case "rainbow":
				parts.push({ text: "Link a" });
				parts.push({ text: "Rainbow", href: "/rainbow" });
				parts.push({ text: "wallet to" });
				break;
			case "coinbase_wallet":
				parts.push({ text: "Link a" });
				parts.push({ text: "Coinbase", href: "https://wallet.coinbase.com" });
				parts.push({ text: "wallet to" });
				break;
			default:
				parts.push({ text: "Link a wallet to" });
				break;
		}

		parts.push({ text: "Your Profile", href: "/user" });

		return parts;
	},
	check: async ({ user, inputs }) => {
		"use server";

		if (user.wallets.length === 0) return false;

		if (inputs.provider) {
			if (inputs.provider.type === "rainbow") {
				return user.wallets.some(
					(wallet) => wallet.walletClientType === "rainbow",
				);
			}

			if (inputs.provider.type === "coinbase_wallet") {
				return user.wallets.some(
					(wallet) => wallet.walletClientType === "coinbase_wallet",
				);
			}
		}

		return true;
	},
	filters: {
		provider: createFilter({
			options: {
				type: {
					name: "Type",
					description: "Name of wallet provider",
					schema: z.enum(["rainbow", "coinbase_wallet"]),
				},
			},
			name: "Wallet Provider",
		}),
	},
});
