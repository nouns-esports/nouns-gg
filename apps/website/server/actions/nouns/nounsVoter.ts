import { z } from "zod";
import { privyClient } from "../../clients/privy";
import { createAction } from "../createAction";
import { viemPublicClients } from "../../clients/viem";
import { parseAbiItem } from "viem";

export const nounsVoter = createAction({
	name: "Nouns Voter",
	schema: z.object({
		block: z.number().nullable().describe("The block number to check from"),
	}),
	check: async ({ user, input }) => {
		const privyUser = await privyClient.getUserById(user.id);

		if (!privyUser) return false;

		const wallets = privyUser.linkedAccounts.filter(
			(account) => account.type === "wallet",
		);

		if (wallets.length === 0) return false;

		const client = viemPublicClients.mainnet;

		for (const wallet of wallets) {
			const votes = await client.readContract({
				address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
				abi: [
					parseAbiItem(
						"function getCurrentVotes(address) view returns (uint96)",
					),
				],
				functionName: "getCurrentVotes",
				blockNumber: input.block ? BigInt(input.block) : undefined,
				args: [wallet.address as `0x${string}`],
			});

			if (votes > 0) {
				return true;
			}
		}

		return false;
	},
});
