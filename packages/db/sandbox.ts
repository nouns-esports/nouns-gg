// import { db } from "./schema";
// import fs from "fs";

// console.log("Starting...");

// const data = {
// 	carts: await db.query.carts.findMany(),
// 	gold: await db.query.gold.findMany(),
// 	nexus: await db.query.nexus.findMany(),
// 	notifications: await db.query.notifications.findMany(),
// 	products: await db.query.products.findMany(),
// 	proposals: await db.query.proposals.findMany(),
// 	snapshots: await db.query.snapshots.findMany(),
// 	votes: await db.query.votes.findMany(),
// 	xp: await db.query.xp.findMany(),
// };

// console.log("Done!");

// fs.writeFileSync("data2.json", JSON.stringify(data, null, 2));

// import fs from "fs";
// import { db } from "./index";
// import {
// 	carts,
// 	gold,
// 	nexus,
// 	notifications,
// 	products,
// 	proposals,
// 	snapshots,
// 	votes,
// 	xp,
// } from "./schema/public";

// const data = JSON.parse(fs.readFileSync("data2.json", "utf8")) as Record<
// 	string,
// 	any
// >;
// for (const [key, value] of Object.entries(data)) {
// 	if (key === "carts" && Array.isArray(value)) {
// 		console.log(`Inserting ${value.length} carts...`);
// 		for (let i = 0; i < value.length; i += 500) {
// 			const chunk = value.slice(i, i + 500);
// 			await db.insert(carts).values(chunk).onConflictDoNothing();
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
