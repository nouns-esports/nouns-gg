import { createPublicClient, http } from "viem";
import * as chains from "viem/chains";
import { env } from "~/env";

export const supportedChains = {
	base: http(`https://base-mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
	baseSepolia: http(`https://base-sepolia.infura.io/v3/${env.INFURA_API_KEY}`),
	mainnet: http(`https://mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
	sepolia: http(`https://sepolia.infura.io/v3/${env.INFURA_API_KEY}`),
	mantle: http(`https://mantle-mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
} as const;

export function viemClient(chain: keyof typeof supportedChains) {
	return createPublicClient({
		chain: chains[chain],
		transport: supportedChains[chain],
	});
}
