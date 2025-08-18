import { z } from "zod";
import { privyClient } from "../../clients/privy";
import { createAction } from "../createAction";
import { viemClient } from "../../clients/viem";
import { parseAbiItem } from "viem";

export const nounishVoter = createAction({
	name: "Nounish Voter",
	schema: z.object({
		nouns: z.object({
			block: z.number().nullable().describe("The block number to check from"),
		}),
		lilnouns: z.object({
			block: z.number().nullable().describe("The block number to check from"),
		}),
		gnars: z.object({
			block: z.number().nullable().describe("The block number to check from"),
		}),
	}),
	check: async ({ user, input }) => {
		const privyUser = await privyClient.getUserById(user.privyId);

		if (!privyUser) return false;

		const wallets = privyUser.linkedAccounts.filter(
			(account) => account.type === "wallet",
		);

		if (wallets.length === 0) return false;

		const client = viemClient("mainnet");
		const baseClient = viemClient("base");

		for (const wallet of wallets) {
			const nounsVotes = await client.readContract({
				address: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
				abi: [
					parseAbiItem(
						"function getCurrentVotes(address) view returns (uint96)",
					),
				],
				functionName: "getCurrentVotes",
				blockNumber: input.nouns.block ? BigInt(input.nouns.block) : undefined,
				args: [wallet.address as `0x${string}`],
			});

			if (nounsVotes > 0) {
				return true;
			}

			const lilnounsVotes = await client.readContract({
				address: "0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b",
				abi: [
					parseAbiItem(
						"function getCurrentVotes(address) view returns (uint96)",
					),
				],
				functionName: "getCurrentVotes",
				blockNumber: input.lilnouns.block
					? BigInt(input.lilnouns.block)
					: undefined,
				args: [wallet.address as `0x${string}`],
			});

			if (lilnounsVotes > 0) {
				return true;
			}

			const gnarsVotes = await baseClient.readContract({
				address: "0x880Fb3Cf5c6Cc2d7DFC13a993E839a9411200C17",
				abi: [
					parseAbiItem("function getVotes(address) view returns (uint256)"),
				],
				functionName: "getVotes",
				blockNumber: input.gnars.block ? BigInt(input.gnars.block) : undefined,
				args: [wallet.address as `0x${string}`],
			});

			if (gnarsVotes > 0) {
				return true;
			}
		}

		return false;
	},
});
