import { viemPublicClients } from "@/server/clients/viem";
import createAction from "../createAction";
import { parseAbi } from "viem";

export const holdERC721 = createAction<{
	contract?: string;
	tokenName?: string;
	url?: string;
}>(async (actionInputs) => {
	if (!actionInputs.contract) {
		throw new Error("Contract Address is required");
	}

	if (!actionInputs.tokenName) {
		throw new Error("Token Name is required");
	}

	if (!actionInputs.url) {
		throw new Error("URL is required");
	}

	return {
		description: <p>Acquire a {actionInputs.tokenName}</p>,
		url: actionInputs.url,
		check: async (user) => {
			for (const wallet of user.wallets) {
				const balance = await viemPublicClients.mainnet.readContract({
					address: actionInputs.contract as `0x${string}`,
					abi: parseAbi([
						"function balanceOf(address) external view returns (uint256)",
					]),
					functionName: "balanceOf",
					args: [wallet.address as `0x${string}`],
				});

				if (balance > 0n) {
					return true;
				}
			}

			return false;
		},
	};
});
