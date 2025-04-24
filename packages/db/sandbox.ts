// import { db } from ".";
// import { eq } from "drizzle-orm";
// import { casts, follows, profiles, reactions } from "./schema/farcaster";
// import fs from "fs";

import { eq } from "drizzle-orm";
import { db } from ".";
import { quests } from "./schema/public";
import { generateSVGPart } from "../utils/generateSVGParts";
import { viemPublicClients } from "~/apps/website/server/clients/viem";
import nounsArtAbi from "~/apps/indexer/abi/NounsArt.ts";
import { unpadSVG } from "../utils/unpadSVG";
// // const someCasts = await db.pgpool.query.casts.findMany({
// // 	where: eq(casts.parentUrl, "https://warpcast.com/~/channel/noundry"),
// // 	limit: 100,
// // 	with: {
// // 		reactions: {
// // 			limit: 100,
// // 		},
// // 		creator: {
// // 			with: {
// // 				followers: {
// // 					limit: 100,
// // 				},
// // 				following: {
// // 					limit: 100,
// // 				},
// // 			},
// // 		},
// // 	},
// // });

// // fs.writeFileSync(
// // 	"someCasts.json",
// // 	JSON.stringify(
// // 		someCasts,
// // 		(key, value) => {
// // 			// Handle Buffer (bytea) by converting to hex string
// // 			if (Buffer.isBuffer(value)) {
// // 				return `0x${value.toString("hex")}`;
// // 			}
// // 			// Handle bigint by converting to number
// // 			if (typeof value === "bigint") {
// // 				return Number(value);
// // 			}
// // 			return value;
// // 		},
// // 		2,
// // 	),
// // );

// const someCasts = JSON.parse(
// 	fs.readFileSync(
// 		"someCasts.json",

// 		"utf8",
// 	),
// 	(key, value) => {
// 		// Convert date strings back to Date objects
// 		if (
// 			typeof value === "string" &&
// 			(key === "createdAt" ||
// 				key === "updatedAt" ||
// 				key === "deletedAt" ||
// 				key === "timestamp" ||
// 				key === "displayTimestamp")
// 		) {
// 			return value ? new Date(value) : null;
// 		}

// 		return value;
// 	},
// );

// await db.pgpool.transaction(async (tx) => {
// 	for (const cast of someCasts) {
// 		await tx
// 			.insert(casts)
// 			.values({ ...cast, reactions: undefined, creator: undefined })
// 			.onConflictDoNothing();

// 		await tx
// 			.insert(profiles)
// 			.values({ ...cast.creator, followers: undefined, following: undefined })
// 			.onConflictDoNothing();

// 		for (const follower of cast.creator.followers) {
// 			await tx.insert(follows).values(follower).onConflictDoNothing();
// 		}

// 		for (const following of cast.creator.following) {
// 			await tx.insert(follows).values(following).onConflictDoNothing();
// 		}

// 		for (const reaction of cast.reactions) {
// 			await tx.insert(reactions).values(reaction).onConflictDoNothing();
// 		}
// 	}
// });

const mainnetClient = viemPublicClients.mainnet;

const imageData = await mainnetClient.readContract({
	address: "0x6544bC8A0dE6ECe429F14840BA74611cA5098A92",
	abi: nounsArtAbi,
	functionName: "heads",
	args: [BigInt(41)],
});

console.log("imageData", imageData);

const palette = await mainnetClient.readContract({
	address: "0x6544bC8A0dE6ECe429F14840BA74611cA5098A92",
	abi: nounsArtAbi,
	functionName: "palettes",
	args: [Number(imageData.slice(0, 4))],
});

console.log("palette", palette);

const head = generateSVGPart({
	image: imageData,
	palette,
});

console.log("head", head);

const unpaddedSVG = await unpadSVG(
	`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320" fill="none">${head}</svg>`,
);

console.log("unpaddedSVG", unpaddedSVG.svg);
