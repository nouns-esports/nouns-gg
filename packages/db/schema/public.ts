import { pgTable, check, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import type { JSONContent as TipTap } from "@tiptap/core";
export const links = pgTable("links", (t) => ({
	id: t.text().primaryKey(),
	url: t.text().notNull(),
}));

export const snapshotTypes = {
	"discord-call": "Attended a community Discord call",
	"visit-link": "",
	genesis: "Were included in the Genesis snapshot",
	"check-in": "Checked in to an event",
	"cgx-airdrop": "Were included in the CGX Airdrop",
} as const;

export const snapshots = pgTable("snapshots", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	type: t
		.text({
			enum: Object.keys(snapshotTypes) as [
				keyof typeof snapshotTypes,
				...Array<keyof typeof snapshotTypes>,
			],
		})
		.notNull(),
	tag: t.text(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
	user: one(nexus, {
		fields: [snapshots.user],
		references: [nexus.id],
	}),
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

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(nexus, {
		fields: [notifications.user],
		references: [nexus.id],
	}),
}));

export const communities = pgTable("communities", (t) => ({
	id: t.text().primaryKey(),
	image: t.text().notNull(),
	name: t.text().notNull(),
	channel: t.text(),
	parent: t.text(),
}));

export const communityRelations = relations(communities, ({ one, many }) => ({
	rosters: many(rosters),
	rounds: many(rounds),
	creations: many(creations),
	events: many(events),
	quests: many(quests),
	children: many(communities, { relationName: "parentToChild" }),
	parent: one(communities, {
		fields: [communities.parent],
		references: [communities.id],
		relationName: "parentToChild",
	}),
}));

export const articles = pgTable("articles", (t) => ({
	id: t.text().primaryKey(),
	title: t.text().notNull(),
	image: t.text().notNull(),
	content: t.jsonb().$type<TipTap>().notNull(),
	publishedAt: t.timestamp("published_at", { mode: "date" }).notNull(),
	editors: t.text().array().notNull(), //.default([]), default arrays are broken with Drizzle Kit right now
}));

export const events = pgTable("events", (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	description: t.text().notNull().default(""),
	start: t.timestamp({ mode: "date" }).notNull(),
	end: t.timestamp({ mode: "date" }).notNull(),
	community: t.text(),
	featured: t.boolean().notNull().default(false),
	callToAction: t.jsonb("call_to_action").$type<{
		disabled: boolean;
		label: string;
		url: string;
	}>(), // not null
	location: t.jsonb().$type<{
		name: string;
		url: string;
	}>(),
	parent: t.text(),
	details: t.jsonb().$type<TipTap>(),
	attendeeCount: t.integer("attendee_count"),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
	community: one(communities, {
		fields: [events.community],
		references: [communities.id],
	}),
	quests: many(quests),
	rounds: many(rounds),
	attendees: many(attendees),
	predictions: many(predictions),
	products: many(products),
	parent: one(events, {
		fields: [events.parent],
		references: [events.id],
	}),
	checkpoints: many(checkpoints),
}));

export const stations = pgTable("stations", (t) => ({
	id: t.serial().primaryKey(),
	name: t.text().notNull(),
	event: t.text().notNull(),
	xp: t.integer().notNull(),
}));

export const checkpoints = pgTable("checkpoints", (t) => ({
	id: t.text().primaryKey(),
	key: t.text().notNull(), // random uuid
	name: t.text().notNull(),
	event: t.text(),
	xp: t.integer(),
	gold: t.numeric({ precision: 12, scale: 2 }),
}));

export const checkpointsRelations = relations(checkpoints, ({ one, many }) => ({
	event: one(events, {
		fields: [checkpoints.event],
		references: [events.id],
	}),
	checkins: many(checkins),
}));

export const checkins = pgTable("checkins", (t) => ({
	id: t.serial().primaryKey(),
	checkpoint: t.text(),
	user: t.text(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const checkinsRelations = relations(checkins, ({ one, many }) => ({
	checkpoint: one(checkpoints, {
		fields: [checkins.checkpoint],
		references: [checkpoints.id],
	}),
	user: one(nexus, {
		fields: [checkins.user],
		references: [nexus.id],
	}),
	gold: many(gold),
	xp: many(xp),
}));

export const predictions = pgTable("predictions", (t) => ({
	id: t.text().primaryKey(),
	event: t.text(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	rules: t.jsonb().notNull(),
	xp: t.integer().notNull().default(0),
	closed: t.boolean().notNull().default(false),
}));

export const predictionsRelations = relations(predictions, ({ one, many }) => ({
	event: one(events, {
		fields: [predictions.event],
		references: [events.id],
	}),
	outcomes: many(outcomes),
	bets: many(bets),
}));

export const outcomes = pgTable("outcomes", (t) => ({
	id: t.serial().primaryKey(),
	prediction: t.text().notNull(),
	name: t.text().notNull(),
	image: t.text(),
	outcome: t.boolean(),
	totalBets: t.integer("total_bets").notNull().default(0),
}));

export const outcomesRelations = relations(outcomes, ({ one, many }) => ({
	prediction: one(predictions, {
		fields: [outcomes.prediction],
		references: [predictions.id],
	}),
	bets: many(bets),
}));

export const bets = pgTable("bets", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	outcome: t.integer().notNull(),
	prediction: t.text().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const betsRelations = relations(bets, ({ one }) => ({
	user: one(nexus, {
		fields: [bets.user],
		references: [nexus.id],
	}),
	outcome: one(outcomes, {
		fields: [bets.outcome],
		references: [outcomes.id],
	}),
	prediction: one(predictions, {
		fields: [bets.prediction],
		references: [predictions.id],
	}),
}));

export const attendees = pgTable("attendees", (t) => ({
	id: t.serial().primaryKey(),
	event: t.text().notNull(),
	featured: t.boolean().notNull().default(false),
	user: t.text().notNull(),
}));

export const attendeesRelations = relations(attendees, ({ one, many }) => ({
	event: one(events, {
		fields: [attendees.event],
		references: [events.id],
	}),
	user: one(nexus, {
		fields: [attendees.user],
		references: [nexus.id],
	}),
	xp: many(xp),
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

export const rosters = pgTable("rosters", (t) => ({
	id: t.text().primaryKey(),
	active: t.boolean().notNull(),
	name: t.text().notNull(),
	community: t.text().notNull(),
	liquipedia: t.text().notNull(),
}));

export const rostersRelations = relations(rosters, ({ one, many }) => ({
	talent: many(talent),
	community: one(communities, {
		fields: [rosters.community],
		references: [communities.id],
	}),
}));

// Deprecate this, require players to create nouns.gg accounts and use that on the roster page
export const talent = pgTable("talent", (t) => ({
	id: t.text().primaryKey(),
	active: t.boolean().notNull(),
	name: t.text().notNull(),
	image: t.text(),
	role: t.text().notNull(),
	roster: t.text().notNull(),
	liquipedia: t.text(),
	twitch: t.text(),
	twitter: t.text(),
	youtube: t.text(),
	tiktok: t.text(),
	instagram: t.text(),
}));

export const talentRelations = relations(talent, ({ one }) => ({
	roster: one(rosters, {
		fields: [talent.roster],
		references: [rosters.id],
	}),
}));

export const rounds = pgTable("rounds", (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	community: t.text(),
	event: t.text(),
	type: t
		.text({ enum: ["markdown", "video", "image"] })
		.notNull()
		.default("markdown"),
	featured: t.boolean().notNull().default(false),
	content: t.text().notNull(),
	// add description - tiptap for migration
	start: t.timestamp({ mode: "date" }).notNull(),
	votingStart: t.timestamp("voting_start", { mode: "date" }).notNull(),
	end: t.timestamp({ mode: "date" }).notNull(),
	minProposerRank: t.integer("min_proposer_rank"),
	minVoterRank: t.integer("min_voter_rank"),
	// proposerCredential: t.text("proposer_credential").notNull().default("nexus"),
	// voterCredential: t.text("voter_credential").notNull().default("nexus"),
}));

export const roundsRelations = relations(rounds, ({ one, many }) => ({
	awards: many(awards),
	proposals: many(proposals),
	votes: many(votes),
	community: one(communities, {
		fields: [rounds.community],
		references: [communities.id],
	}),
	event: one(events, {
		fields: [rounds.event],
		references: [events.id],
	}),
	minProposerRank: one(ranks, {
		fields: [rounds.minProposerRank],
		references: [ranks.id],
	}),
	minVoterRank: one(ranks, {
		fields: [rounds.minVoterRank],
		references: [ranks.id],
	}),
}));

// add user column and update it when they claim the award
export const awards = pgTable("awards", (t) => ({
	id: t.serial().primaryKey(),
	round: t.text().notNull(),
	place: t.smallint().notNull(),
	asset: t.text().notNull().default(""),
	value: t.numeric({ precision: 78, scale: 0 }).notNull(),
	claimed: t.boolean().notNull().default(false),
}));

export const awardsRelations = relations(awards, ({ one }) => ({
	round: one(rounds, {
		fields: [awards.round],
		references: [rounds.id],
	}),
	asset: one(assets, {
		fields: [awards.asset],
		references: [assets.id],
	}),
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
	round: t.text().notNull(),
	title: t.text().notNull(),
	content: t.text(), // rename to description
	image: t.text(),
	video: t.text(),
	createdAt: t.timestamp("created_at", { mode: "date" }).notNull(),
	hidden: t.boolean().notNull().default(false),
	published: t.boolean().notNull().default(true),
}));

export const proposalsRelations = relations(proposals, ({ one, many }) => ({
	round: one(rounds, {
		fields: [proposals.round],
		references: [rounds.id],
	}),
	votes: many(votes),
	user: one(nexus, {
		fields: [proposals.user],
		references: [nexus.id],
	}),
	xp: many(xp),
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
		// wallets: jsonb("wallets")
		// 	.$type<{
		// 		address: string;
		// 		type: string;
		// 	}>()
		// 	.array()
		// 	.notNull(),
		// // 	.default([]), defaults + jsonb are broken with Drizzle Kit right now
		twitter: t.text(),
		discord: t.text(),
		fid: t.integer(),
		gold: t.numeric({ precision: 12, scale: 2 }).notNull().default("0"),
		canRecieveEmails: t.boolean("can_recieve_emails").notNull().default(false),
	}),
	(table) => [check("gold_balance", sql`${table.gold} >= 0`)],
);

export const nexusRelations = relations(nexus, ({ one, many }) => ({
	votes: many(votes),
	proposals: many(proposals),
	rankings: many(rankings),
	xpRecords: many(xp),
	rank: one(ranks, {
		fields: [nexus.rank],
		references: [ranks.id],
	}),
	creations: many(creations),
	notifications: many(notifications),
	// orders: many(orders),
	carts: many(carts),
}));

export const gold = pgTable("gold", (t) => ({
	id: t.serial().primaryKey(),
	from: t.text(),
	to: t.text(),
	amount: t.numeric({ precision: 12, scale: 2 }).notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
	ranking: t.integer(),
	order: t.text(), // shopify DraftOrder gid
	checkin: t.integer(),
}));

export const goldRelations = relations(gold, ({ one }) => ({
	from: one(nexus, {
		fields: [gold.from],
		references: [nexus.id],
	}),
	to: one(nexus, {
		fields: [gold.to],
		references: [nexus.id],
	}),
	ranking: one(rankings, {
		fields: [gold.ranking],
		references: [rankings.id],
	}),
	checkin: one(checkins, {
		fields: [gold.checkin],
		references: [checkins.id],
	}),
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

export const ranksRelations = relations(ranks, ({ one, many }) => ({
	nexus: many(nexus),
}));

export const quests = pgTable("quests", (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	description: t.text().notNull(),
	image: t.text().notNull(),
	community: t.text(),
	event: t.text(),
	createdAt: t.timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
	featured: t.boolean().notNull().default(false),
	active: t.boolean().notNull().default(false),
	start: t.timestamp({ mode: "date" }),
	end: t.timestamp({ mode: "date" }),
	xp: t.integer().notNull(),
	actions: t.text().array().notNull(),
	actionInputs: t
		.jsonb("action_inputs")
		.array()
		.$type<Array<{ [key: string]: any }>>()
		.notNull(),
	// .default([]), defaults + jsonb are broken with Drizzle Kit right now
}));

export const questRelations = relations(quests, ({ one, many }) => ({
	community: one(communities, {
		fields: [quests.community],
		references: [communities.id],
	}),
	completed: many(xp),
	event: one(events, {
		fields: [quests.event],
		references: [events.id],
	}),
}));

export const xp = pgTable("xp", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	amount: t.integer().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
	quest: t.text(),
	snapshot: t.integer(),
	achievement: t.text(),
	station: t.integer(),
	checkin: t.integer(),
	prediction: t.text(),
	vote: t.integer(),
	proposal: t.integer(),
	order: t.text(), // shopify Order gid
	attendee: t.integer(),
}));

export const xpRelations = relations(xp, ({ one }) => ({
	user: one(nexus, {
		fields: [xp.user],
		references: [nexus.id],
	}),
	quest: one(quests, {
		fields: [xp.quest],
		references: [quests.id],
	}),
	snaphot: one(snapshots, {
		fields: [xp.snapshot],
		references: [snapshots.id],
	}),
	checkin: one(checkins, {
		fields: [xp.checkin],
		references: [checkins.id],
	}),
	prediction: one(predictions, {
		fields: [xp.prediction],
		references: [predictions.id],
	}),
	vote: one(votes, {
		fields: [xp.vote],
		references: [votes.id],
	}),
	proposal: one(proposals, {
		fields: [xp.proposal],
		references: [proposals.id],
	}),
	attendee: one(attendees, {
		fields: [xp.attendee],
		references: [attendees.id],
	}),
	// order: one(orders, {
	// 	fields: [xp.order],
	// 	references: [orders.id],
	// }),
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

export const rankingsRelations = relations(rankings, ({ one, many }) => ({
	user: one(nexus, {
		fields: [rankings.user],
		references: [nexus.id],
	}),
	rank: one(ranks, {
		fields: [rankings.rank],
		references: [ranks.id],
	}),
	gold: one(gold, {
		fields: [rankings.gold],
		references: [gold.id],
	}),
}));

export const votes = pgTable("votes", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	proposal: t.integer().notNull(),
	round: t.text().notNull(),
	count: t.smallint().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const votesRelations = relations(votes, ({ one, many }) => ({
	proposal: one(proposals, {
		fields: [votes.proposal],
		references: [proposals.id],
	}),
	round: one(rounds, {
		fields: [votes.round],
		references: [rounds.id],
	}),
	user: one(nexus, {
		fields: [votes.user],
		references: [nexus.id],
	}),
	xp: many(xp),
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
	community: t.text(),
	width: t.integer().notNull(),
	height: t.integer().notNull(),
}));

export const creationsRelations = relations(creations, ({ one }) => ({
	original: one(creations, {
		fields: [creations.original],
		references: [creations.id],
	}),
	community: one(communities, {
		fields: [creations.community],
		references: [communities.id],
	}),
	creator: one(nexus, {
		fields: [creations.creator],
		references: [nexus.id],
	}),
}));

export const products = pgTable("products", (t) => ({
	id: t.text().primaryKey(),
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
	collection: t.text(),
	event: t.text(),
	requiresShipping: t.boolean("requires_shipping").notNull().default(true),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
	collection: one(collections, {
		fields: [products.collection],
		references: [collections.id],
	}),
	event: one(events, {
		fields: [products.event],
		references: [events.id],
	}),
}));

export const collections = pgTable("collections", (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	featured: t.boolean().notNull().default(false),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
	products: many(products),
}));

export const carts = pgTable("carts", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	product: t.text().notNull(),
	variant: t.text().notNull(),
	quantity: t.integer().notNull(),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
	user: one(nexus, {
		fields: [carts.user],
		references: [nexus.id],
	}),
	product: one(products, {
		fields: [carts.product],
		references: [products.id],
	}),
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

// Ranks should be soulbound ERC1155 tokens managed by us where the art shows their dynamic ranking image (maybe like a badge that shows stats also)
// export const delegates = pgTable("delegates", {
// 	id: serial("id").primaryKey(),
// 	from: text("from").notNull(),
// 	to: text("to").notNull(),
// 	round: text("round"),
// });

// export const delegatesRelations = relations(delegates, ({ one }) => ({
// 	from: one(nexus, {
// 		fields: [delegates.from],
// 		references: [nexus.id],
// 	}),
// 	to: one(nexus, {
// 		fields: [delegates.to],
// 		references: [nexus.id],
// 	}),
// 	round: one(rounds, {
// 		fields: [delegates.round],
// 		references: [rounds.id],
// 	}),
// }));
