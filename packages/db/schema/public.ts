import { pgTable, check, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { JSONContent as TipTap } from "@tiptap/core";

export const links = pgTable("links", (t) => ({
	id: t.text().primaryKey(),
	url: t.text().notNull(),
}));

export const snapshots = pgTable("snapshots", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	type: t
		.text({
			enum: [
				"discord-call",
				"visit-link",
				"genesis",
				"check-in",
				"cgx-airdrop",
			],
		})
		.notNull(),
	tag: t.text(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const notifications = pgTable("notifications", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
	image: t.text().notNull(),
	title: t.text().notNull(),
	description: t.text().notNull(),
	url: t.text(),
	read: t.boolean().notNull().default(false),
}));

export const communities = pgTable("communities", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	image: t.text().notNull(),
	name: t.text().notNull(),
	description: t.jsonb().$type<TipTap>(), //.notNull(),
	channel: t.text(),
	// membershipActions: t.text("membership_actions").array(),
	// membershipActionInputs: t
	// 	.jsonb("membership_action_inputs")
	// 	.array()
	// 	.$type<Array<{ [key: string]: any }>>(),
}));

export const communityAdmins = pgTable("community_admins", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	community: t.bigint({ mode: "number" }).notNull(),
	user: t.text().notNull(),
	owner: t.boolean().notNull(),
}));

export const articles = pgTable("articles", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	title: t.text().notNull(),
	image: t.text().notNull(),
	content: t.jsonb().$type<TipTap>().notNull(),
	draft: t.boolean().notNull().default(true),
	publishedAt: t.timestamp("published_at", { mode: "date" }).notNull(),
	editors: t.text().array().notNull(), //.default([]), default arrays are broken with Drizzle Kit right now
}));

export const events = pgTable("events", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	description: t.text().notNull().default(""),
	start: t.timestamp({ mode: "date" }).notNull(),
	end: t.timestamp({ mode: "date" }).notNull(),
	community: t.bigint({ mode: "number" }),
	creator: t.text(),
	draft: t.boolean().notNull().default(true),
	featured: t.boolean().notNull().default(false),
	callToAction: t.jsonb("call_to_action").$type<{
		disabled: boolean;
		label: string;
		url: string;
	}>(),
	// .notNull(),
	location: t.jsonb().$type<{
		name: string;
		url: string;
	}>(),
	details: t.jsonb().$type<TipTap>(),
	attendeeCount: t.integer("attendee_count"),
	// registrationActions: t.text("registration_actions").array(),
	// registrationActionInputs: t
	// 	.jsonb("registration_action_inputs")
	// 	.array()
	// 	.$type<Array<{ [key: string]: any }>>(),
}));

export const stations = pgTable("stations", (t) => ({
	id: t.serial().primaryKey(),
	name: t.text().notNull(),
	event: t.text().notNull(),
	xp: t.integer().notNull(),
}));

export const checkpoints = pgTable("checkpoints", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	key: t.text().notNull(), // random uuid
	name: t.text().notNull(),
	event: t.bigint({ mode: "number" }),
	xp: t.integer(),
	gold: t.numeric({ precision: 12, scale: 2 }),
}));

export const checkins = pgTable("checkins", (t) => ({
	id: t.serial().primaryKey(),
	checkpoint: t.bigint({ mode: "number" }).notNull(),
	user: t.text(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const predictions = pgTable("predictions", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	event: t.bigint({ mode: "number" }),
	creator: t.text(),
	community: t.bigint({ mode: "number" }),
	draft: t.boolean().notNull().default(true),
	name: t.text().notNull(),
	image: t.text().notNull(),
	rules: t.jsonb().$type<TipTap>().notNull(),
	xp: t.integer().notNull(),
	closed: t.boolean().notNull().default(false),
	resolved: t.boolean().notNull().default(false),
	featured: t.boolean().notNull().default(false),
	start: t.timestamp(),
	end: t.timestamp(),
	pool: t.numeric({ precision: 12, scale: 2 }).notNull().default("0"),
}));

export const outcomes = pgTable("outcomes", (t) => ({
	id: t.serial().primaryKey(),
	prediction: t.bigint({ mode: "number" }).notNull(),
	name: t.text().notNull(),
	image: t.text(),
	result: t.boolean(),
	pool: t.numeric({ precision: 12, scale: 2 }).notNull().default("0"),
}));

export const bets = pgTable("bets", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	outcome: t.integer().notNull(),
	amount: t.numeric({ precision: 12, scale: 2 }).notNull().default("0"),
	prediction: t.bigint({ mode: "number" }).notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const attendees = pgTable("attendees", (t) => ({
	id: t.serial().primaryKey(),
	event: t.bigint({ mode: "number" }).notNull(),
	featured: t.boolean().notNull().default(false),
	user: t.text().notNull(),
}));

// export const brackets = pgTable("brackets", {
// 	id: serial("id").primaryKey(),
// 	event: text("event").notNull(),
// 	name: text("name").notNull(),
// 	image: text("image").notNull(),
// });

// export const phases = pgTable("phases", {
// 	id: serial("id").primaryKey(),
// 	bracket: text("bracket").notNull(),
// 	name: text("name").notNull(),
// });

// export const matches = pgTable("matches", {
// 	id: serial("id").primaryKey(),
// 	bracket: text("bracket").notNull(),
// 	event: text("event").notNull(),
// 	player1: text("player1"),
// 	player2: text("player2"),
// 	player1Score: integer("player1_score"),
// 	player2Score: integer("player2_score"),
// });

export const rounds = pgTable("rounds", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	community: t.bigint({ mode: "number" }),
	event: t.bigint({ mode: "number" }),
	creator: t.text(),
	draft: t.boolean().notNull().default(true),
	type: t
		.text({ enum: ["markdown", "video", "image"] })
		.notNull()
		.default("markdown"),
	featured: t.boolean().notNull().default(false),
	content: t.text().notNull(),
	description: t.jsonb().$type<TipTap>(), //.notNull(),  tiptap migration
	start: t.timestamp({ mode: "date" }).notNull(),
	votingStart: t.timestamp("voting_start", { mode: "date" }).notNull(),
	end: t.timestamp({ mode: "date" }).notNull(),
	minProposerRank: t.integer("min_proposer_rank"),
	minVoterRank: t.integer("min_voter_rank"),
	proposerCredential: t.text("proposer_credential"),
	voterCredential: t.text("voter_credential"),
	// voterActions: t.text("voter_actions").array(),
	// voterActionInputs: t
	// 	.jsonb("voter_action_inputs")
	// 	.array()
	// 	.$type<Array<{ [key: string]: any }>>(),
	// proposerActions: t.text("proposer_actions").array(),
	// proposerActionInputs: t
	// 	.jsonb("proposer_action_inputs")
	// 	.array()
	// 	.$type<Array<{ [key: string]: any }>>(),
}));

// add user column and update it when they claim the award
export const awards = pgTable("awards", (t) => ({
	id: t.serial().primaryKey(),
	round: t.bigint({ mode: "number" }).notNull(),
	place: t.smallint().notNull(),
	asset: t.text().notNull(),
	value: t.numeric({ precision: 78, scale: 0 }).notNull(),
	claimed: t.boolean().notNull().default(false),
}));

// Rethink the way we handle awards and assets
export const assets = pgTable("assets", (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	decimals: t.smallint(),
	chainId: t.integer("chain_id"),
	address: t.text(),
	tokenId: t.text("token_id"),
}));

export const proposals = pgTable("proposals", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	round: t.bigint({ mode: "number" }).notNull(),
	title: t.text().notNull(),
	content: t.text(), // rename to description
	image: t.text(),
	video: t.text(),
	createdAt: t.timestamp("created_at", { mode: "date" }).notNull(),
	hidden: t.boolean().notNull().default(false),
	published: t.boolean().notNull().default(true),
}));

export const nexus = pgTable(
	"nexus",
	(t) => ({
		id: t.text().primaryKey(),
		username: t.text().unique(),
		admin: t.boolean().notNull().default(false),
		rank: t.integer(),
		xp: t.integer().notNull().default(0),
		image: t.text().notNull().default(""),
		name: t.text().notNull().default(""),
		bio: t.text(),
		interests: t.text().array().notNull(), //.default([]),  default arrays are broken with Drizzle Kit right now
		twitter: t.text(),
		discord: t.text(),
		fid: t.integer(),
		gold: t.numeric({ precision: 12, scale: 2 }).notNull().default("0"),
		canRecieveEmails: t.boolean("can_recieve_emails").notNull().default(false),
	}),
	(table) => [check("gold_balance", sql`${table.gold} >= 0`)],
);

export const gold = pgTable("gold", (t) => ({
	id: t.serial().primaryKey(),
	from: t.text(),
	to: t.text(),
	amount: t.numeric({ precision: 12, scale: 2 }).notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
	ranking: t.integer(),
	order: t.text(), // shopify DraftOrder gid
	checkin: t.integer(),
	raffleEntry: t.integer(),
	bet: t.integer(),
	prediction: t.bigint({ mode: "number" }),
}));

export const ranks = pgTable("ranks", (t) => ({
	id: t.serial().primaryKey(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	color: t.text().notNull().default(""),
	place: t.smallint().notNull(),
	percentile: t.numeric({ precision: 4, scale: 3 }).notNull(), // ex: 0.01 === 1%, 0.001 === 0.1%, 0.0001 === 0.01%
	votes: t.smallint().notNull(),
	active: t.boolean().notNull().default(true),
}));

export const quests = pgTable("quests", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	name: t.text().notNull(),
	description: t.text().notNull(),
	_description: t.jsonb().$type<TipTap>(), //.notNull(),
	image: t.text().notNull(),
	community: t.bigint({ mode: "number" }),
	creator: t.text(),
	event: t.bigint({ mode: "number" }),
	draft: t.boolean().notNull().default(true),
	createdAt: t.timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
	featured: t.boolean().notNull().default(false),
	active: t.boolean().notNull().default(false),
	start: t.timestamp({ mode: "date" }),
	end: t.timestamp({ mode: "date" }),
	xp: t.integer().notNull(),
	// Rethink actions, should be a global concept to rounds, quests, achievements, event signups, raffle entries, etc...
	actions: t.text().array().notNull(),
	actionInputs: t
		.jsonb("action_inputs")
		.array()
		.$type<Array<{ [key: string]: any }>>()
		.notNull(),
	// .default([]), defaults + jsonb are broken with Drizzle Kit right now
}));

export const xp = pgTable("xp", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	amount: t.integer().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
	reason: t.text(),
	quest: t.bigint({ mode: "number" }),
	snapshot: t.integer(),
	achievement: t.text(),
	station: t.integer(),
	checkin: t.integer(),
	prediction: t.bigint({ mode: "number" }),
	vote: t.integer(),
	proposal: t.integer(),
	order: t.text(), // shopify Order gid
	raffleEntry: t.integer(),
	attendee: t.integer(),
}));

export const rankings = pgTable(
	"rankings",
	(t) => ({
		id: t.serial().primaryKey(),
		user: t.text().notNull(),
		rank: t.integer().notNull(),
		gold: t.integer(),
		score: t.integer().notNull(),
		timestamp: t.timestamp({ mode: "date" }).notNull(),
	}),
	(table) => [
		index("rankings_timestamp_idx").on(table.timestamp),
		index("rankings_user_idx").on(table.user),
		index("rankings_score_idx").on(table.score),
	],
);

export const votes = pgTable("votes", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	proposal: t.integer().notNull(),
	round: t.bigint({ mode: "number" }).notNull(),
	count: t.smallint().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const creations = pgTable("creations", (t) => ({
	id: t.text().primaryKey(),
	creator: t.text(),
	type: t
		.text({
			enum: ["art", "photograph", "video", "emote", "sticker", "gif"],
		})
		.notNull()
		.default("art"),
	title: t.text(),
	createdAt: t.timestamp("created_at", { mode: "date" }),
	original: t.text(),
	width: t.integer().notNull(),
	height: t.integer().notNull(),
}));

export const products = pgTable("products", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	shopifyId: t.text("shopify_id").notNull(),
	name: t.text().notNull(),
	description: t.text().notNull(),
	images: t.text().array().notNull(), //.default([]), default arrays are broken with Drizzle Kit right now
	sizeGuide: t.text("size_guide"),
	variants: t
		.jsonb()
		.array()
		.$type<
			Array<{
				shopifyId: string;
				size?: "s" | "m" | "l" | "xl" | "2xl";
				price: number;
				inventory?: number;
			}>
		>()
		.notNull(),
	// .default([]), defaults + jsonb are broken with Drizzle Kit right now
	collection: t.bigint({ mode: "number" }),
	event: t.bigint({ mode: "number" }),
	creator: t.text(),
	community: t.bigint({ mode: "number" }),
	requiresShipping: t.boolean("requires_shipping").notNull().default(true),
	active: t.boolean().notNull().default(true),
}));

export const collections = pgTable("collections", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	featured: t.boolean().notNull().default(false),
}));

export const carts = pgTable("carts", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	product: t.bigint({ mode: "number" }).notNull(),
	variant: t.text().notNull(),
	quantity: t.integer().notNull(),
}));

// export const orders = pgTable("orders", {
// 	id: serial("id").primaryKey(),
// 	draft: boolean("draft").notNull().default(true),
// 	shopifyId: text("shopify_id").notNull(),
// 	customer: text("customer").notNull(),
// 	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
// 	items: jsonb("items")
// 		.array()
// 		.$type<
// 			Array<{
// 				shopifyId: string;
// 				quantity: number;
// 				price: number;
// 			}>
// 		>()
// 		.notNull()
// 		.default([]),
// });

// export const ordersRelations = relations(orders, ({ one }) => ({
// 	customer: one(nexus, {
// 		fields: [orders.customer],
// 		references: [nexus.id],
// 	}),
// 	xp: one(xp, {
// 		fields: [orders.id],
// 		references: [xp.order],
// 	}),
// 	gold: one(gold, {
// 		fields: [orders.id],
// 		references: [gold.order],
// 	}),
// }));

export const linkedWallets = pgTable("linked_wallets", (t) => ({
	address: t.text().primaryKey(),
	user: t.text().notNull(),
	chains: t.integer().array().notNull(),
	client: t
		.text({ enum: ["rainbow", "metamask", "coinbase_wallet"] })
		.notNull(),
}));

export const linkedTwitters = pgTable("linked_twitters", (t) => ({
	username: t.text().primaryKey(),
	user: t.text().notNull(),
}));

export const linkedDiscords = pgTable("linked_discords", (t) => ({
	username: t.text().primaryKey(),
	user: t.text().notNull(),
}));

export const linkedFarcasters = pgTable("linked_farcasters", (t) => ({
	fid: t.bigint({ mode: "number" }).primaryKey(),
	user: t.text().notNull(),
	username: t.text().notNull(),
}));

export const raffles = pgTable("raffles", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	name: t.text().notNull(),
	description: t.jsonb().$type<TipTap>().notNull(),
	images: t.text().array().notNull(),
	start: t.timestamp().notNull(),
	end: t.timestamp().notNull(),
	gold: t.integer().notNull(),
	winners: t.integer().notNull(),
	limit: t.integer(),
	event: t.bigint({ mode: "number" }),
	creator: t.text(),
	community: t.bigint({ mode: "number" }),
	draft: t.boolean().notNull().default(true),
	// entryActions: t.text("entry_actions").array(),
	// entryActionInputs: t
	// 	.jsonb("entry_action_inputs")
	// 	.array()
	// 	.$type<Array<{ [key: string]: any }>>(),
}));

export const raffleEntries = pgTable("raffle_entries", (t) => ({
	id: t.serial().primaryKey(),
	raffle: t.bigint({ mode: "number" }).notNull(),
	user: t.text().notNull(),
	timestamp: t.timestamp().notNull(),
	amount: t.integer().notNull(),
	winner: t.boolean().notNull().default(false),
}));
