import { drizzle } from "drizzle-orm/node-postgres";
import {
	boolean,
	pgTable,
	text,
	timestamp,
	numeric,
	serial,
	smallint,
	integer,
	jsonb,
	unique,
	bigint,
	check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { Pool } from "pg";
import { env } from "~/env";

export const links = pgTable("links", {
	id: text("id").primaryKey(),
	url: text("url").notNull(),
});

export const snapshotTypes = {
	"discord-call": "Attended a community Discord call",
	"visit-link": "",
	genesis: "Were included in the Genesis snapshot",
	"check-in": "Checked in to an event",
	"cgx-airdrop": "Were included in the CGX Airdrop",
} as const;

export const snapshots = pgTable("snapshots", {
	id: serial("id").primaryKey(),
	user: text("user").notNull(),
	type: text("type", {
		enum: Object.keys(snapshotTypes) as [
			keyof typeof snapshotTypes,
			...Array<keyof typeof snapshotTypes>,
		],
	}).notNull(),
	tag: text("tag"),
	timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
});

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
	user: one(nexus, {
		fields: [snapshots.user],
		references: [nexus.id],
	}),
}));

export const notifications = pgTable("notifications", {
	id: serial("id").primaryKey(),
	user: text("user").notNull(),
	timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
	image: text("image").notNull(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	url: text("url"),
	read: boolean("read").notNull().default(false),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(nexus, {
		fields: [notifications.user],
		references: [nexus.id],
	}),
}));

export const communities = pgTable("communities", {
	id: text("id").primaryKey(),
	image: text("image").notNull(),
	name: text("name").notNull(),
	channel: text("channel"),
	parent: text("parent"),
});

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

export const articles = pgTable("articles", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	image: text("image").notNull(),
	content: jsonb("content").$type<Record<string, any>>().notNull(),
	publishedAt: timestamp("publishedAt", { mode: "date" }).notNull(),
	editors: text("editors").array().notNull().default([]),
});

export const events = pgTable("events", {
	id: text("id").primaryKey(),
	location: text("location"),
	name: text("name").notNull(),
	image: text("image").notNull(),
	description: text("description").notNull().default(""),
	start: timestamp("start", { mode: "date" }).notNull(),
	end: timestamp("end", { mode: "date" }).notNull(),
	community: text("community"),
	featured: boolean("featured").notNull().default(false),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
	community: one(communities, {
		fields: [events.community],
		references: [communities.id],
	}),
	quests: many(quests),
	rounds: many(rounds),
	attendees: many(attendees),
	predictions: many(predictions),
}));

export const stations = pgTable("stations", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	event: text("event").notNull(),
	xp: integer("xp").notNull(),
});

export const stationsRelations = relations(stations, ({ one }) => ({
	event: one(events, {
		fields: [stations.event],
		references: [events.id],
	}),
}));

export const predictions = pgTable("predictions", {
	id: text("id").primaryKey(),
	event: text("event"),
	name: text("name").notNull(),
	image: text("image").notNull(),
	rules: jsonb("rules").notNull(),
	xp: integer("xp").notNull().default(0),
	closed: boolean("closed").notNull().default(false),
});

export const predictionsRelations = relations(predictions, ({ one, many }) => ({
	event: one(events, {
		fields: [predictions.event],
		references: [events.id],
	}),
	outcomes: many(outcomes),
	bets: many(bets),
}));

export const outcomes = pgTable("outcomes", {
	id: serial("id").primaryKey(),
	prediction: text("prediction").notNull(),
	name: text("name").notNull(),
	image: text("image"),
	outcome: boolean("outcome"),
	totalBets: integer("total_bets").notNull().default(0),
});

export const outcomesRelations = relations(outcomes, ({ one, many }) => ({
	prediction: one(predictions, {
		fields: [outcomes.prediction],
		references: [predictions.id],
	}),
	bets: many(bets),
}));

export const bets = pgTable("bets", {
	id: serial("id").primaryKey(),
	user: text("user").notNull(),
	outcome: integer("outcome").notNull(),
	prediction: text("prediction").notNull(),
	timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
});

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

export const attendees = pgTable("attendees", {
	id: serial("id").primaryKey(),
	event: text("event").notNull(),
	type: text("type", {
		enum: ["competitor", "spectator", "staff", "vip"],
	}).notNull(),
	user: text("user").notNull(),
});

export const attendeesRelations = relations(attendees, ({ one }) => ({
	event: one(events, {
		fields: [attendees.event],
		references: [events.id],
	}),
	user: one(nexus, {
		fields: [attendees.user],
		references: [nexus.id],
	}),
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

export const rosters = pgTable("rosters", {
	id: text("id").primaryKey(),
	active: boolean("active").notNull(),
	name: text("name").notNull(),
	community: text("community").notNull(),
	liquipedia: text("liquipedia").notNull(),
});

export const rostersRelations = relations(rosters, ({ one, many }) => ({
	talent: many(talent),
	community: one(communities, {
		fields: [rosters.community],
		references: [communities.id],
	}),
}));

// Deprecate this, require players to create nouns.gg accounts and use that on the roster page
export const talent = pgTable("talent", {
	id: text("id").primaryKey(),
	active: boolean("active").notNull(),
	name: text("name").notNull(),
	image: text("image"),
	role: text("role").notNull(),
	roster: text("roster").notNull(),
	liquipedia: text("liquipedia"),
	twitch: text("twitch"),
	twitter: text("twitter"),
	youtube: text("youtube"),
	tiktok: text("tiktok"),
	instagram: text("instagram"),
});

export const talentRelations = relations(talent, ({ one }) => ({
	roster: one(rosters, {
		fields: [talent.roster],
		references: [rosters.id],
	}),
}));

export const rounds = pgTable("rounds", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	image: text("image").notNull(),
	community: text("community"),
	event: text("event"),
	type: text("type", { enum: ["markdown", "video", "image"] })
		.notNull()
		.default("markdown"),
	featured: boolean("featured").notNull().default(false),
	content: text("content").notNull(), // use markdown instead
	// add description - tiptap for migration
	start: timestamp("start", { mode: "date" }).notNull(),
	votingStart: timestamp("voting_start", { mode: "date" }).notNull(),
	end: timestamp("end", { mode: "date" }).notNull(),
	minProposerRank: integer("min_proposer_rank"),
	minVoterRank: integer("min_voter_rank"),
	// proposerCredential: text("proposer_credential").notNull().default("nexus"),
	// voterCredential: text("voter_credential").notNull().default("nexus"),
});

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
export const awards = pgTable("awards", {
	id: serial("id").primaryKey(),
	round: text("round").notNull(),
	place: smallint("place").notNull(),
	asset: text("asset").notNull().default(""),
	value: numeric("value", { precision: 78 }).notNull(),
	claimed: boolean("claimed").notNull().default(false),
});

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
export const assets = pgTable("assets", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	image: text("image").notNull(),
	decimals: smallint("decimals"),
	chainId: integer("chain_id"),
	address: text("address"),
	tokenId: text("token_id"),
});

export const proposals = pgTable("proposals", {
	id: serial("id").primaryKey(),
	user: text("user").notNull(),
	round: text("round").notNull(),
	title: text("title").notNull(),
	content: text("content"), // rename to description
	image: text("image"),
	video: text("video"),
	createdAt: timestamp("created_at", { mode: "date" }).notNull(),
	hidden: boolean("hidden").notNull().default(false),
	published: boolean("published").notNull().default(true),
});

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
	{
		id: text("id").primaryKey(),
		username: text("username").unique(),
		admin: boolean("admin").notNull().default(false),
		rank: integer("rank"),
		xp: integer("xp").notNull().default(0),
		image: text("image").notNull().default(""),
		name: text("name").notNull().default(""),
		bio: text("bio"),
		interests: text("interests").array().notNull().default([]),
		// wallets: jsonb("wallets")
		// 	.$type<{
		// 		address: string;
		// 		type: string;
		// 	}>()
		// 	.array()
		// 	.notNull()
		// 	.default([]),
		twitter: text("twitter"),
		discord: text("discord"),
		fid: integer("fid"),
		gold: integer("gold").notNull().default(0),
		canRecieveEmails: boolean("can_recieve_emails").notNull().default(false),
	},
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

export const gold = pgTable("gold", {
	id: serial("id").primaryKey(),
	from: text("from"),
	to: text("to"),
	amount: integer("amount").notNull(),
	timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
	ranking: integer("ranking"),
	order: text("order"), // shopify DraftOrder gid
});

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
}));

export const ranks = pgTable("ranks", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	image: text("image").notNull(),
	color: text("color").notNull().default(""),
	place: smallint("place").notNull(),
	percentile: numeric("percentile", { precision: 4, scale: 3 }).notNull(), // ex: 0.01 === 1%, 0.001 === 0.1%, 0.0001 === 0.01%
	votes: smallint("votes").notNull(),
	active: boolean("active").notNull().default(true),
});

export const ranksRelations = relations(ranks, ({ one, many }) => ({
	nexus: many(nexus),
}));

export const quests = pgTable("quests", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	image: text("image").notNull(),
	community: text("community"),
	event: text("event"),
	createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
	featured: boolean("featured").notNull().default(false),
	active: boolean("active").notNull().default(false),
	start: timestamp("start", { mode: "date" }),
	end: timestamp("end", { mode: "date" }),
	xp: integer("xp").notNull(),
	actions: text("actions").array().notNull(),
	actionInputs: jsonb("action_inputs")
		.array()
		.$type<Array<{ [key: string]: any }>>()
		.notNull()
		.default([]),
});

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

export const xp = pgTable("xp", {
	id: serial("id").primaryKey(),
	user: text("user").notNull(),
	amount: integer("amount").notNull(),
	timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
	quest: text("quest"),
	snapshot: integer("snapshot"),
	achievement: text("achievement"),
	station: integer("station"),
	prediction: text("prediction"),
	vote: integer("vote"),
	proposal: integer("proposal"),
	order: text("order"), // shopify Order gid
});

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
	station: one(stations, {
		fields: [xp.station],
		references: [stations.id],
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
	// order: one(orders, {
	// 	fields: [xp.order],
	// 	references: [orders.id],
	// }),
}));

export const rankings = pgTable("rankings", {
	id: serial("id").primaryKey(),
	user: text("user").notNull(),
	rank: integer("rank").notNull(),
	gold: integer("gold"),
	score: integer("score").notNull(),
	timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
});

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

export const votes = pgTable("votes", {
	id: serial("id").primaryKey(),
	user: text("user").notNull(),
	proposal: integer("proposal").notNull(),
	round: text("round").notNull(),
	count: smallint("count").notNull(),
	timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
});

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

export const creations = pgTable("creations", {
	id: text("id").primaryKey(),
	creator: text("creator"),
	type: text("type", {
		enum: ["art", "photograph", "video", "emote", "sticker", "gif"],
	})
		.notNull()
		.default("art"),
	title: text("title"),
	createdAt: timestamp("created_at", { mode: "date" }),
	original: text("original"),
	community: text("community"),
	width: integer("width").notNull(),
	height: integer("height").notNull(),
});

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

export const products = pgTable("products", {
	id: text("id").primaryKey(),
	shopifyId: text("shopify_id").notNull(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	images: text("images").array().notNull().default([]),
	variants: jsonb("variants")
		.array()
		.$type<
			Array<{
				shopifyId: string;
				size?: "s" | "m" | "l" | "xl" | "2xl";
				price: number;
				inventory: number;
			}>
		>()
		.notNull()
		.default([]),
	collection: text("collection"),
});

export const productsRelations = relations(products, ({ one, many }) => ({
	collection: one(collections, {
		fields: [products.collection],
		references: [collections.id],
	}),
}));

export const collections = pgTable("collections", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	image: text("image").notNull(),
	featured: boolean("featured").notNull().default(false),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
	products: many(products),
}));

export const carts = pgTable("carts", {
	id: serial("id").primaryKey(),
	user: text("user").notNull(),
	product: text("product").notNull(),
	variant: text("variant").notNull(),
	quantity: integer("quantity").notNull(),
});

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

const schema = {
	communities,
	communityRelations,
	rosters,
	rostersRelations,
	talent,
	talentRelations,
	rounds,
	roundsRelations,
	awards,
	awardsRelations,
	assets,
	proposals,
	proposalsRelations,
	votes,
	votesRelations,
	nexus,
	nexusRelations,
	events,
	eventsRelations,
	creations,
	creationsRelations,
	ranks,
	ranksRelations,
	quests,
	questRelations,
	xp,
	xpRelations,
	rankings,
	rankingsRelations,
	links,
	snapshots,
	snapshotsRelations,
	notifications,
	notificationsRelations,
	attendees,
	attendeesRelations,
	stations,
	stationsRelations,
	predictions,
	predictionsRelations,
	outcomes,
	outcomesRelations,
	bets,
	betsRelations,
	articles,
	gold,
	goldRelations,
	products,
	productsRelations,
	collections,
	collectionsRelations,
	carts,
	cartsRelations,
	// orders,
	// ordersRelations,
};

export const db = drizzle(
	new Pool({
		connectionString: env.DATABASE_URL,
	}),
	{
		schema,
	},
);

export type Community = typeof communities.$inferSelect;
export type Roster = typeof rosters.$inferSelect;
export type Talent = typeof talent.$inferSelect;
export type Round = typeof rounds.$inferSelect;
export type Award = typeof awards.$inferSelect;
export type Asset = typeof assets.$inferSelect;
export type Proposal = typeof proposals.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type Nexus = typeof nexus.$inferSelect;
export type Creation = typeof creations.$inferSelect;
export type Rank = typeof ranks.$inferSelect;
export type Rankings = typeof rankings.$inferSelect;
export type Quest = typeof quests.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Snapshot = typeof snapshots.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Bet = typeof bets.$inferSelect;
export type Outcome = typeof outcomes.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
export type Station = typeof stations.$inferSelect;
export type Link = typeof links.$inferSelect;
export type Attendee = typeof attendees.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Gold = typeof gold.$inferSelect;
