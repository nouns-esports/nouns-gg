import type { NextConfig } from "next";

export default {
	outputFileTracingIncludes: {
		"/*": ["../../data/public/v1/**/*.json"],
	},
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
