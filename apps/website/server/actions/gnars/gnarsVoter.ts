import { parseAbiItem } from "viem";
import { z } from "zod";
import { privyClient } from "../../clients/privy";
import { createAction } from "../createAction";
import { viemClient } from "../../clients/viem";

export const gnarsVoter = createAction({
	name: "Gnars Voter",
	schema: z.object({
		block: z.number().nullable().describe("The block number to check from"),
	}),
	check: async ({ user, input }) => {
		const privyUser = await privyClient.getUserById(user.privyId);

		if (!privyUser) return false;

		const wallets = privyUser.linkedAccounts.filter(
			(account) => account.type === "wallet",
		);

		if (wallets.length === 0) return false;

		const client = viemClient("base");

		for (const wallet of wallets) {
			const votes = await client.readContract({
				address: "0x880Fb3Cf5c6Cc2d7DFC13a993E839a9411200C17",
				abi: [
					parseAbiItem("function getVotes(address) view returns (uint256)"),
				],
				functionName: "getVotes",
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
