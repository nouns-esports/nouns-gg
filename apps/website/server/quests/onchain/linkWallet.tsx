import createAction from "../createAction";

export const linkWallet = createAction<{
	type?: "rainbow" | "coinbase_wallet";
}>(async (actionInputs) => {
	return {
		description: (
			<p>
				{
					{
						any: "Link an Ethereum wallet",
						rainbow: "Link a Rainbow wallet",
						coinbase_wallet: "Link a Coinbase Smart Wallet",
					}[actionInputs.type ?? "any"]
				}
			</p>
		),
		url: actionInputs.type === "rainbow" ? "/rainbow" : "/nexus",
		check: async (user) => {
			if (user.wallets.length === 0) return false;

			if (actionInputs.type === "rainbow") {
				return user.wallets.some(
					(wallet) => wallet.walletClientType === "rainbow",
				);
			}

			if (actionInputs.type === "coinbase_wallet") {
				return user.wallets.some(
					(wallet) => wallet.walletClientType === "coinbase_wallet",
				);
			}

			return true;
		},
	};
});
