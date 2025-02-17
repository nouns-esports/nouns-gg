import type { NextConfig } from "next";
// Checks env during build
import { env } from "~/env";

export default {
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "storage.googleapis.com",
				pathname: "**",
			},
			{ protocol: "https", hostname: "i.ytimg.com", pathname: "**" },
			{ protocol: "https", hostname: "ipfs.nouns.gg", pathname: "**" },
		],
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
} satisfies NextConfig;
