console.log("PINATA_JWT", process.env.PINATA_JWT);

const createJiti = require("jiti");
const jiti = createJiti(__filename);
jiti("../../env");

console.log("PINATA_JWT", process.env.PINATA_JWT);

/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
