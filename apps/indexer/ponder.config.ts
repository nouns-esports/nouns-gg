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

export default createConfig({
	networks: {
		mainnet: {
			chainId: 1,
			transport: rateLimit(
				http(`https://mainnet.infura.io/v3/${env.INFURA_API_KEY}`),
				{
					requestsPerSecond: 4,
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
			network: "mainnet",
			abi: NounsTokenABI,
			address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
			startBlock: 12985438,
		},
		LilNounsToken: {
			network: "mainnet",
			abi: LilNounsTokenABI,
			address: "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B",
			startBlock: 14736710,
		},
		NounsAuctionHouse: {
			network: "mainnet",
			abi: NounsAuctionHouseABI,
			address: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
			startBlock: 12985451,
		},
		NounsDAOGovernor: {
			network: "mainnet",
			abi: NounsDAOGovernorABI,
			address: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
			startBlock: 12985453,
		},
		NounsDescriptor: {
			network: "mainnet",
			abi: NounsDescriptorABI,
			address: "0x33A9c445fb4FB21f2c030A6b2d3e2F12D017BFAC",
			startBlock: 12985438,
		},
		NounsRewards: {
			network: "mainnet",
			abi: NounsRewardsABI,
			address: "0x883860178F95d0C82413eDc1D6De530cB4771d55",
			startBlock: 19818566,
		},
		NounsArt: {
			network: "mainnet",
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
	},
	blocks: {
		TimestampSync: {
			network: "mainnet",
			startBlock: 12985438,
			interval: 1,
		},
	},
	database: {
		kind: "postgres",
		connectionString: env.PRIMARY_DATABASE_URL,
	},
});
