// import { db } from "./schema";
// import fs from "fs";

// console.log("Starting...");

// const data = {
// 	articles: await db.query.articles.findMany(),
// 	assets: await db.query.assets.findMany(),
// 	attendees: await db.query.attendees.findMany(),
// 	awards: await db.query.awards.findMany(),
// 	bets: await db.query.bets.findMany(),
// 	carts: await db.query.carts.findMany(),
// 	collections: await db.query.collections.findMany(),
// 	communities: await db.query.communities.findMany(),
// 	creations: await db.query.creations.findMany(),
// 	events: await db.query.events.findMany(),
// 	gold: await db.query.gold.findMany(),
// 	links: await db.query.links.findMany(),
// 	nexus: await db.query.nexus.findMany(),
// 	notifications: await db.query.notifications.findMany(),
// 	outcomes: await db.query.outcomes.findMany(),
// 	predictions: await db.query.predictions.findMany(),
// 	products: await db.query.products.findMany(),
// 	proposals: await db.query.proposals.findMany(),
// 	quests: await db.query.quests.findMany(),
// 	rankings: await db.query.rankings.findMany(),
// 	ranks: await db.query.ranks.findMany(),
// 	rosters: await db.query.rosters.findMany(),
// 	rounds: await db.query.rounds.findMany(),
// 	snapshots: await db.query.snapshots.findMany(),
// 	stations: await db.query.stations.findMany(),
// 	talent: await db.query.talent.findMany(),
// 	votes: await db.query.votes.findMany(),
// 	xp: await db.query.xp.findMany(),
// };

// console.log("Done!");

// fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

// import fs from "fs";
// import { db } from "./index";
// import {
// 	articles,
// 	assets,
// 	attendees,
// 	awards,
// 	bets,
// 	carts,
// 	collections,
// 	communities,
// 	creations,
// 	events,
// 	gold,
// 	links,
// 	nexus,
// 	notifications,
// 	outcomes,
// 	predictions,
// 	products,
// 	proposals,
// 	quests,
// 	rankings,
// 	ranks,
// 	rosters,
// 	rounds,
// 	snapshots,
// 	stations,
// 	talent,
// 	votes,
// 	xp,
// } from "./schema/public";

// const data = JSON.parse(fs.readFileSync("data.json", "utf8")) as Record<
// 	string,
// 	any
// >;
// for (const [key, value] of Object.entries(data)) {
// 	if (key === "articles" && Array.isArray(value)) {
// 		console.log(value);
// 		console.log(`Inserting ${value.length} articles...`);

// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(articles)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						publishedAt: item.publishedAt
// 							? new Date(item.publishedAt)
// 							: item.publishedAt,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "assets" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} assets...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(assets).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	// if (key === "attendees" && Array.isArray(value)) {
// 	// 	console.log(`Inserting ${value.length} attendees...`);
// 	// 	await db.insert(attendees).values(value).onConflictDoNothing();
// 	// }
// 	if (key === "awards" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} awards...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(awards).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "bets" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} bets...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(bets)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						timestamp: item.timestamp
// 							? new Date(item.timestamp)
// 							: item.timestamp,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "carts" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} carts...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(carts).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "collections" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} collections...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(collections).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "communities" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} communities...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(communities).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "creations" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} creations...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(creations)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						createdAt: item.createdAt
// 							? new Date(item.createdAt)
// 							: item.createdAt,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "events" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} events...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(events)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						start: item.start ? new Date(item.start) : item.start,
// 						end: item.end ? new Date(item.end) : item.end,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "gold" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} gold...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(gold)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						timestamp: item.timestamp
// 							? new Date(item.timestamp)
// 							: item.timestamp,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "links" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} links...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(links).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "nexus" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} nexus...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(nexus).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "notifications" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} notifications...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(notifications)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						timestamp: item.timestamp
// 							? new Date(item.timestamp)
// 							: item.timestamp,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "outcomes" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} outcomes...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(outcomes).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "predictions" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} predictions...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(predictions).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "products" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} products...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(products).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "proposals" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} proposals...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(proposals)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						createdAt: item.createdAt
// 							? new Date(item.createdAt)
// 							: item.createdAt,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "quests" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} quests...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(quests)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						createdAt: item.createdAt
// 							? new Date(item.createdAt)
// 							: item.createdAt,
// 						start: item.start ? new Date(item.start) : item.start,
// 						end: item.end ? new Date(item.end) : item.end,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "rankings" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} rankings...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(rankings)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						timestamp: item.timestamp
// 							? new Date(item.timestamp)
// 							: item.timestamp,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "ranks" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} ranks...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(ranks).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "rosters" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} rosters...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(rosters).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "rounds" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} rounds...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(rounds)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						start: item.start ? new Date(item.start) : item.start,
// 						votingStart: item.votingStart
// 							? new Date(item.votingStart)
// 							: item.votingStart,
// 						end: item.end ? new Date(item.end) : item.end,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "snapshots" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} snapshots...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(snapshots)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						timestamp: item.timestamp
// 							? new Date(item.timestamp)
// 							: item.timestamp,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "stations" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} stations...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(stations).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "talent" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} talent...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(talent).values(chunk).onConflictDoNothing();
// 		}
// 	}
// 	if (key === "votes" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} votes...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(votes)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						timestamp: item.timestamp
// 							? new Date(item.timestamp)
// 							: item.timestamp,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// 	if (key === "xp" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} xp...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db
// 				.insert(xp)
// 				.values(
// 					chunk.map((item) => ({
// 						...item,
// 						timestamp: item.timestamp
// 							? new Date(item.timestamp)
// 							: item.timestamp,
// 					})),
// 				)
// 				.onConflictDoNothing();
// 		}
// 	}
// }

// import { db } from "./index";

// import { isFriday } from "date-fns";
// import { rankings } from "./schema/public";
// import { inArray, lt } from "drizzle-orm";

// console.log("Starting...");
// // Condense rankings to only keep Friday records
// // Fetch all ranking records
// const allRankings = await db.query.rankings.findMany({
// 	where: lt(rankings.timestamp, new Date("2025-02-16")),
// });
// console.log(`Found ${allRankings.length} total ranking records`);

// // Filter out rankings that aren't on Fridays
// const nonFridayRankings = allRankings.filter((ranking) => {
// 	// Ensure timestamp is a Date object
// 	const date = new Date(ranking.timestamp);

// 	// Keep only non-Friday records (these will be removed)
// 	return !isFriday(date);
// });

// console.log(
// 	`Found ${nonFridayRankings.length} rankings not on Fridays to remove`,
// );

// // Delete non-Friday rankings in batches
// for (let i = 0; i < nonFridayRankings.length; i += 500) {
// 	const chunk = nonFridayRankings.slice(i, i + 500);
// 	const ids = chunk.map((ranking) => ranking.id);

// 	await db.transaction(async (tx) => {
// 		await tx.delete(rankings).where(inArray(rankings.id, ids));
// 	});

// 	console.log(
// 		`Deleted batch ${i / 500 + 1} of ${Math.ceil(nonFridayRankings.length / 500)}`,
// 	);

// 	await new Promise((resolve) => setTimeout(resolve, 1000));
// }

// console.log("Done!");

// import { eq, or } from "drizzle-orm";
// import { db } from "./index";
// import { rankings } from "./schema/public";

// await db
// 	.delete(rankings)
// 	.where(
// 		or(
// 			eq(rankings.timestamp, new Date("2024-12-06T22:00:00.749Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T21:00:00.959Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T20:00:00.66Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T19:00:00.891Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T18:00:00.771Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T17:00:00.474Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T16:00:00.615Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T15:00:00.619Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T14:00:00.57Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T13:00:00.473Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T12:00:00.499Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T11:00:00.758Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T10:00:00.867Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T09:00:00.48Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T08:00:00.855Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T07:00:00.533Z")),
// 			eq(rankings.timestamp, new Date("2024-12-06T06:00:00.554Z")),
// 			eq(rankings.timestamp, new Date("2024-12-07T00:00:00.071Z")),
// 			eq(rankings.timestamp, new Date("2024-12-07T01:00:00.6Z")),
// 			eq(rankings.timestamp, new Date("2024-12-07T02:00:00.687Z")),
// 			eq(rankings.timestamp, new Date("2024-12-07T03:00:00.536Z")),
// 			eq(rankings.timestamp, new Date("2024-12-07T04:00:00.089Z")),
// 		),
// 	);
