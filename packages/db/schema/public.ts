import { pgTable, check, index, primaryKey, pgSchema } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { JSONContent as TipTap } from "@tiptap/core";
import type { ActionDescription } from "~/apps/website/server/actions/createAction";

export const archiveSchema = pgSchema("archive");

export const links = archiveSchema.table("links", (t) => ({
	id: t.text().primaryKey(),
	url: t.text().notNull(),
}));

export const visits = archiveSchema.table("visits", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	user: t.text().notNull(),
	url: t.text().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const snapshots = archiveSchema.table("snapshots", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	type: t
		.text({
			enum: ["discord-call", "visit-link", "genesis"],
		})
		.notNull(),
	tag: t.text(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const communities = archiveSchema.table("communities", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	image: t.text().notNull(),
	name: t.text().notNull(),
	description: t.jsonb().$type<TipTap>(),
	parentUrl: t.text("parent_url"),
	gold: t.integer().notNull().default(0),
	details: t.jsonb().$type<TipTap>(),
	featured: t.boolean().notNull().default(false),
}));

export const communityActions = archiveSchema.table("community_actions", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	community: t.bigint({ mode: "number" }).notNull(),
	action: t.text().notNull(),
	description: t.jsonb().array().$type<ActionDescription>().notNull(),
	inputs: t
		.jsonb()
		.$type<{ [key: string]: { [key: string]: any } }>()
		.notNull(),
}));

export const communityAdmins = archiveSchema.table("community_admins", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	community: t.bigint({ mode: "number" }).notNull(),
	user: t.text().notNull(),
	owner: t.boolean().notNull(),
}));

export const articles = archiveSchema.table("articles", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	title: t.text().notNull(),
	image: t.text().notNull(),
	content: t.jsonb().$type<TipTap>().notNull(),
	draft: t.boolean().notNull().default(true),
	publishedAt: t.timestamp("published_at", { mode: "date" }).notNull(),
	community: t.bigint({ mode: "number" }).notNull().default(0), // drop default
}));

export const events = archiveSchema.table("events", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	description: t.text().notNull().default(""),
	start: t.timestamp({ mode: "date" }).notNull(),
	end: t.timestamp({ mode: "date" }).notNull(),
	community: t.bigint({ mode: "number" }).notNull(),
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
}));

export const eventActions = archiveSchema.table("event_actions", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	event: t.bigint({ mode: "number" }).notNull(),
	action: t.text().notNull(),
	description: t.jsonb().array().$type<ActionDescription>().notNull(),
	inputs: t
		.jsonb()
		.$type<{ [key: string]: { [key: string]: any } }>()
		.notNull(),
}));

export const stations = archiveSchema.table("stations", (t) => ({
	id: t.serial().primaryKey(),
	name: t.text().notNull(),
	event: t.text().notNull(),
	xp: t.integer().notNull(),
}));

export const checkpoints = archiveSchema.table("checkpoints", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	key: t.text().notNull(), // random uuid
	name: t.text().notNull(),
	event: t.bigint({ mode: "number" }),
	xp: t.integer(),
	gold: t.numeric({ precision: 12, scale: 2 }),
}));

export const checkins = archiveSchema.table("checkins", (t) => ({
	id: t.serial().primaryKey(),
	checkpoint: t.bigint({ mode: "number" }).notNull(),
	user: t.text(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const predictions = archiveSchema.table("predictions", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	event: t.bigint({ mode: "number" }),
	community: t.bigint({ mode: "number" }).notNull(),
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

export const outcomes = archiveSchema.table("outcomes", (t) => ({
	id: t.serial().primaryKey(),
	prediction: t.bigint({ mode: "number" }).notNull(),
	name: t.text().notNull(),
	image: t.text(),
	result: t.boolean(),
	pool: t.numeric({ precision: 12, scale: 2 }).notNull().default("0"),
}));

export const bets = archiveSchema.table("bets", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	outcome: t.integer().notNull(),
	amount: t.numeric({ precision: 12, scale: 2 }).notNull().default("0"),
	prediction: t.bigint({ mode: "number" }).notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const attendees = archiveSchema.table("attendees", (t) => ({
	id: t.serial().primaryKey(),
	event: t.bigint({ mode: "number" }).notNull(),
	featured: t.boolean().notNull().default(false),
	user: t.text().notNull(),
}));

export const rounds = archiveSchema.table("rounds", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	community: t.bigint({ mode: "number" }).notNull(),
	event: t.bigint({ mode: "number" }),
	draft: t.boolean().notNull().default(true),
	type: t
		.text({ enum: ["markdown", "video", "image", "url"] })
		.notNull()
		.default("markdown"),
	featured: t.boolean().notNull().default(false),
	content: t.text().notNull(),
	description: t.jsonb().$type<TipTap>(), //.notNull(),  tiptap migration
	start: t.timestamp({ mode: "date" }).notNull(),
	votingStart: t.timestamp("voting_start", { mode: "date" }).notNull(),
	end: t.timestamp({ mode: "date" }).notNull(),
	minTitleLength: t.integer("min_title_length").notNull().default(15),
	maxTitleLength: t.integer("max_title_length").notNull().default(100),
	minDescriptionLength: t
		.integer("min_description_length")
		.notNull()
		.default(0),
	maxDescriptionLength: t
		.integer("max_description_length")
		.notNull()
		.default(2000),
	linkRegex: t.text("link_regex"),
	maxProposals: t.smallint("max_proposals").default(1),
}));

export const roundActions = archiveSchema.table("round_actions", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	round: t.bigint({ mode: "number" }).notNull(),
	type: t
		.text({ enum: ["voting", "proposing"] })
		.notNull()
		.default("voting"),
	action: t.text().notNull(),
	description: t.jsonb().array().$type<ActionDescription>().notNull(),
	inputs: t
		.jsonb()
		.$type<{ [key: string]: { [key: string]: any } }>()
		.notNull(),
}));

// export const incentives = pgTable("incentives", (t) => ({
// 	id: t.bigserial({ mode: "number" }).primaryKey(),
// 	pot: t.numeric({ precision: 12, scale: 2 }).notNull().default("0"),
// }));

// add user column and update it when they claim the award
export const awards = archiveSchema.table("awards", (t) => ({
	id: t.serial().primaryKey(),
	round: t.bigint({ mode: "number" }).notNull(),
	place: t.smallint().notNull(),
	asset: t.text().notNull(),
	value: t.numeric({ precision: 78, scale: 0 }).notNull(),
	claimed: t.boolean().notNull().default(false),
}));

// Rethink the way we handle awards and assets
export const assets = archiveSchema.table("assets", (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	decimals: t.smallint(),
	chainId: t.integer("chain_id"),
	address: t.text(),
	tokenId: t.text("token_id"),
}));

export const proposals = archiveSchema.table("proposals", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	round: t.bigint({ mode: "number" }).notNull(),
	title: t.text().notNull(),
	content: t.text(), // rename to description
	image: t.text(),
	video: t.text(),
	url: t.text(),
	createdAt: t.timestamp("created_at", { mode: "date" }).notNull(),
	hidden: t.boolean().notNull().default(false),
	published: t.boolean().notNull().default(true),
	winner: t.smallint(),
}));

export const nexus = archiveSchema.table(
	"nexus",
	(t) => ({
		id: t.text().primaryKey(),
		admin: t.boolean().notNull().default(false),
		xp: t.integer().notNull().default(0),
		image: t.text().notNull().default(""),
		name: t.text().notNull().default(""),
		bio: t.text(),
		twitter: t.text(),
		discord: t.text(),
		fid: t.integer(),
		gold: t.numeric({ precision: 12, scale: 2 }).notNull().default("0"),
		canRecieveEmails: t.boolean("can_recieve_emails").notNull().default(false),
	}),
	(table) => [check("gold_balance", sql`${table.gold} >= 0`)],
);

export const gold = archiveSchema.table("gold", (t) => ({
	id: t.serial().primaryKey(),
	from: t.text(),
	fromCommunity: t.bigint({ mode: "number" }),
	to: t.text(),
	toCommunity: t.bigint({ mode: "number" }),
	amount: t.numeric({ precision: 12, scale: 2 }).notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
	ranking: t.integer(),
	order: t.text(), // shopify DraftOrder gid
	checkin: t.integer(),
	raffleEntry: t.integer(),
	bet: t.integer(),
	prediction: t.bigint({ mode: "number" }),
}));

export const quests = archiveSchema.table("quests", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	name: t.text().notNull(),
	description: t.jsonb().$type<TipTap>(),
	image: t.text().notNull(),
	community: t.bigint({ mode: "number" }).notNull(),
	event: t.bigint({ mode: "number" }),
	draft: t.boolean().notNull().default(true),
	createdAt: t.timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
	featured: t.boolean().notNull().default(false),
	active: t.boolean().notNull().default(false),
	start: t.timestamp({ mode: "date" }),
	end: t.timestamp({ mode: "date" }),
	xp: t.integer().notNull(),
}));

export const questActions = archiveSchema.table("quest_actions", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	quest: t.bigint({ mode: "number" }).notNull(),
	action: t.text().notNull(),
	description: t.jsonb().array().$type<ActionDescription>().notNull(),
	inputs: t
		.jsonb()
		.$type<{ [key: string]: { [key: string]: any | undefined } }>()
		.notNull(),
}));

export const questCompletions = archiveSchema.table("quest_completions", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	quest: t.bigint({ mode: "number" }).notNull(),
	user: t.text().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const xp = archiveSchema.table("xp", (t) => ({
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
	community: t.bigint({ mode: "number" }).notNull(),
}));

export const leaderboards = archiveSchema.table(
	"leaderboards",
	(t) => ({
		community: t.bigint({ mode: "number" }).notNull(),
		user: t.text().notNull(),
		xp: t.bigint({ mode: "number" }).notNull(),
	}),
	(t) => [
		primaryKey({ columns: [t.user, t.community] }),
		index("leaderboards_xp_idx").on(t.xp),
	],
);

export const rankings = archiveSchema.table(
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

export const votes = archiveSchema.table("votes", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	proposal: t.integer().notNull(),
	round: t.bigint({ mode: "number" }).notNull(),
	count: t.smallint().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull(),
}));

export const products = archiveSchema.table("products", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	shopifyId: t.text("shopify_id").notNull(),
	name: t.text().notNull(),
	description: t.jsonb().$type<TipTap>(),
	collection: t.bigint({ mode: "number" }),
	event: t.bigint({ mode: "number" }),
	community: t.bigint({ mode: "number" }).notNull(),
	requiresShipping: t.boolean("requires_shipping").notNull(),
	active: t.boolean().notNull().default(true),
}));

export const productVariants = archiveSchema.table("product_variants", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	product: t.bigint({ mode: "number" }).notNull(),
	shopifyId: t.text("shopify_id").notNull(),
	images: t.text().array().notNull(),
	size: t.text({ enum: ["xs", "s", "m", "l", "xl", "2xl", "3xl", "4xl"] }),
	color: t.jsonb().$type<{
		name: string;
		hex: string;
	}>(),
	price: t.numeric({ precision: 12, scale: 2, mode: "number" }).notNull(),
	inventory: t.integer(),
}));

export const collections = archiveSchema.table("collections", (t) => ({
	id: t.bigserial({ mode: "number" }).primaryKey(),
	handle: t.text().notNull().unique(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	featured: t.boolean().notNull().default(false),
}));

export const carts = archiveSchema.table("carts", (t) => ({
	id: t.serial().primaryKey(),
	user: t.text().notNull(),
	product: t.bigint({ mode: "number" }).notNull(),
	variant: t.bigint({ mode: "number" }).notNull(),
	quantity: t.integer().notNull(),
}));


export const linkedWallets = archiveSchema.table("linked_wallets", (t) => ({
	address: t.text().primaryKey(),
	user: t.text().notNull(),
	client: t.text({ enum: ["rainbow", "metamask", "coinbase_wallet"] }),
}));

export const raffles = archiveSchema.table("raffles", (t) => ({
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
	community: t.bigint({ mode: "number" }).notNull(),
	draft: t.boolean().notNull().default(true),
	entryActions: t.text("entry_actions").array(),
	entryActionInputs: t
		.jsonb("entry_action_inputs")
		.array()
		.$type<Array<{ [key: string]: any }>>(),
}));

export const raffleEntries = archiveSchema.table("raffle_entries", (t) => ({
	id: t.serial().primaryKey(),
	raffle: t.bigint({ mode: "number" }).notNull(),
	user: t.text().notNull(),
	timestamp: t.timestamp().notNull(),
	amount: t.integer().notNull(),
	winner: t.boolean().notNull().default(false),
}));
