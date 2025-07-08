import { createConfig, rateLimit } from "ponder";
import { http } from "viem";
import { env } from "~/env";

import NounsTokenABI from "./abi/NounsToken";
import LilNounsTokenABI from "./abi/LilNounsToken";

import NounsAuctionHouseABI from "./abi/NounsAuctionHouse";
import NounsDAOGovernorABI from "./abi/NounsDAOGovernor";
import ERC20ABI from "./abi/ERC20";
import ERC721ABI from "./abi/ERC721";
import ERC1155ABI from "./abi/ERC1155";
import NounsDescriptorABI from "./abi/NounsDescriptor";
import NounsRewardsABI from "./abi/NounsRewards";
import NounsArtABI from "./abi/NounsArt";
import { mergeAbis } from "@ponder/utils";
import NounsDAOLogicV1ABI from "./abi/NounsDAOLogicV1";
import NounsDAOLogicV2ABI from "./abi/NounsDAOLogicV2";
import NounsDAOLogicV3ABI from "./abi/NounsDAOLogicV3";
import NounsDAOLogicV4ABI from "./abi/NounsDAOLogicV4";

export default createConfig({
	chains: {
		mainnet: {
			id: 1,
			rpc: rateLimit(
				http(`https://mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
				{
					requestsPerSecond: 20,
				},
			),
		},
		mantle: {
			id: 5000,
			rpc: rateLimit(
				http(`https://mantle-mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
				{
					requestsPerSecond: 20,
				},
			),
		},
		// base: {
		// 	chainId: 8453,
		// 	transport: rateLimit(
		// 		http(`https://base-mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
		// 		{
		// 			requestsPerSecond: 5,
		// 		},
		// 	),
		// },
	},
	contracts: {
		NounsToken: {
			chain: "mainnet",
			abi: NounsTokenABI,
			address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
			startBlock: 12985438,
		},
		LilNounsToken: {
			chain: "mainnet",
			abi: LilNounsTokenABI,
			address: "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B",
			startBlock: 14736710,
		},
		NounsAuctionHouse: {
			chain: "mainnet",
			abi: NounsAuctionHouseABI,
			address: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
			startBlock: 12985451,
		},
		NounsDAOGovernor: {
			chain: "mainnet",
			abi: mergeAbis([
				NounsDAOLogicV1ABI,
				NounsDAOLogicV2ABI,
				NounsDAOLogicV3ABI,
				NounsDAOLogicV4ABI,
			]),
			address: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
			startBlock: 12985453,
		},
		NounsDescriptor: {
			chain: "mainnet",
			abi: NounsDescriptorABI,
			address: "0x33A9c445fb4FB21f2c030A6b2d3e2F12D017BFAC",
			startBlock: 12985438,
		},
		NounsRewards: {
			chain: "mainnet",
			abi: NounsRewardsABI,
			address: "0x883860178F95d0C82413eDc1D6De530cB4771d55",
			startBlock: 19818566,
		},
		NounsArt: {
			chain: "mainnet",
			abi: NounsArtABI,
			address: "0x6544bC8A0dE6ECe429F14840BA74611cA5098A92",
			startBlock: 20584339,
		},
		// NounsTokenERC20: {
		// 	network: "base",
		// 	abi: ERC20ABI,
		// 	address: "0x0a93a7be7e7e426fc046e204c44d6b03a302b631",
		// 	startBlock: 15399701,
		// },
		MantleMainnetToken: {
			chain: "mainnet",
			abi: ERC20ABI,
			address: "0x3c3a81e81dc49a522a592e7622a7e711c06bf354",
			startBlock: 17519070,
		},
		MantleToken: {
			chain: "mantle",
			abi: ERC20ABI,
			address: "0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8",
			startBlock: 2832,
		},
		CookMainnetToken: {
			chain: "mainnet",
			abi: ERC20ABI,
			address: "0x9F0C013016E8656bC256f948CD4B79ab25c7b94D",
			startBlock: 20618978,
		},
		CookToken: {
			chain: "mantle",
			abi: ERC20ABI,
			address: "0x9F0C013016E8656bC256f948CD4B79ab25c7b94D",
			startBlock: 68309647,
		},
	},
	database: {
		kind: "postgres",
		connectionString: env.PRIMARY_DATABASE_URL,
	},
});
