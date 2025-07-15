import { z } from "zod";
import { viemPublicClients } from "../../clients/viem";
import { createAction } from "../createAction";
import { parseAbiItem } from "viem";

export const holdERC1155 = createAction({
	name: "Hold ERC1155",
	schema: z.object({
		address: z.string().describe("The Ethereum address"),
		chain: z
			.enum(Object.keys(viemPublicClients) as [string, ...string[]])
			.describe("The chain ID"),
		tokenId: z.number().describe("The token ID"),
		minBalance: z.number().describe("The minimum balance of the token"),
		block: z.number().nullable().describe("The block number to check from"),
	}),
	check: async ({ input }) => {
		const client =
			viemPublicClients[input.chain as keyof typeof viemPublicClients];

		const balance = await client.readContract({
			address: input.address as `0x${string}`,
			abi: [
				parseAbiItem(
					"function balanceOf(address owner, uint256 id) view returns (uint256)",
				),
			],
			functionName: "balanceOf",
			blockNumber: input.block ? BigInt(input.block) : undefined,
			args: [input.address as `0x${string}`, BigInt(input.tokenId)],
		});

		if (balance >= input.minBalance) {
			return true;
		}

		return false;
	},
});
