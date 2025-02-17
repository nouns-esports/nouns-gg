import { createPublicClient, http } from "viem";
import { base, baseSepolia, mainnet } from "viem/chains";
import { env } from "~/env";

export const viemPublicClients = {
	base: createPublicClient({
		chain: base,
		transport: http(`https://base-mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
	}),
	baseSepolia: createPublicClient({
		chain: baseSepolia,
		transport: http(`https://base-sepolia.infura.io/v3/${env.INFURA_API_KEY}`),
	}),
	mainnet: createPublicClient({
		chain: mainnet,
		transport: http(`https://mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
	}),
} as const;
