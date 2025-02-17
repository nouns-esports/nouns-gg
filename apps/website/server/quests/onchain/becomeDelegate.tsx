import { viemPublicClients } from "@/server/clients/viem";
import createAction from "../createAction";
import { parseAbi } from "viem";

export const becomeDelegate = createAction<{
	contract?: string;
	url?: string;
	tokenName?: string;
}>(async (actionInputs) => {
	if (!actionInputs.contract) {
		throw new Error("DAO Contract Address is required");
	}

	if (!actionInputs.url) {
		throw new Error("URL is required");
	}

	return {
		description: <p>Become a {actionInputs.tokenName ?? ""} delegate</p>,
		url: actionInputs.url,
		check: async (user) => {
			for (const wallet of user.wallets) {
				const [currentVotes, balance] = await Promise.all([
					viemPublicClients.mainnet.readContract({
						address: actionInputs.contract as `0x${string}`,
						abi: parseAbi([
							"function getCurrentVotes(address) external view returns (uint96)",
						]),
						functionName: "getCurrentVotes",
						args: [wallet.address as `0x${string}`],
					}),
					viemPublicClients.mainnet.readContract({
						address: actionInputs.contract as `0x${string}`,
						abi: parseAbi([
							"function balanceOf(address) external view returns (uint256)",
						]),
						functionName: "balanceOf",
						args: [wallet.address as `0x${string}`],
					}),
				]);

				if (currentVotes > 0n || balance > 0n) {
					return true;
				}
			}

			return false;
		},
	};
});
