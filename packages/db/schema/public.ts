import {
	pgTable,
	check,
	index,
	primaryKey,
	text,
	unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { JSONContent as TipTap } from "@tiptap/core";
import type { ActionDescription } from "~/apps/website/server/actions/createAction";

const platforms = () => text({ enum: ["discord", "farcaster", "twitter"] });
const connections = () =>
	text({ enum: ["discord:server", "farcaster:channel", "farcaster:account"] });

export const meta = pgTable("meta", (t) => ({
	maintenance: t.boolean().notNull().default(false),
}));

export const links = pgTable("links", (t) => ({
	id: t.text().primaryKey(),
	url: t.text().notNull(),
}));

export const visits = pgTable("visits", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	user: t.uuid().notNull(),
	url: t.text().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull().defaultNow(),
}));

export const snapshots = pgTable("snapshots", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	user: t.uuid().notNull(),
	type: t.text().notNull(),
	tag: t.text(),
	timestamp: t.timestamp({ mode: "date" }).notNull().defaultNow(),
}));

export const communities = pgTable("communities", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	handle: t.text().notNull().unique(),
	image: t.text().notNull(),
	name: t.text().notNull(),
	levels: t.jsonb().$type<{
		max: number;
		midpoint: number;
		steepness: number;
	}>(),
	points: t.jsonb().$type<{
		name: string;
		image: string;
		marketcap: number;
	}>(),
	agent: t.jsonb().$type<{
		name: string;
		image: string;
		prompt: string;
	}>(),
	description: t.jsonb().$type<TipTap>(),
	parentUrl: t.text("parent_url"),
	details: t.jsonb().$type<TipTap>(),
	featured: t.boolean().notNull().default(false),
}));

export const communityAdmins = pgTable(
	"community_admins",
	(t) => ({
		id: t.uuid().defaultRandom().primaryKey(),
		community: t.uuid().notNull(),
		user: t.uuid().notNull(),
		owner: t.boolean().notNull(),
	}),
	(t) => [
		unique("community_admins_community_user_unique").on(t.community, t.user),
	],
);

export const communityConnections = pgTable("community_connections", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	type: connections().notNull(),
	platform: platforms().notNull(),
	community: t.uuid().notNull(),
	config: t.jsonb().notNull().$type<Record<string, any>>(),
}));

export const wallets = pgTable(
	"wallets",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		address: t.text().unique().notNull(),
		user: t.uuid(),
		community: t.uuid(),
	}),
	(t) => [
		check(
			"user_or_community_exists",
			sql`(user IS NOT NULL OR community IS NOT NULL)`,
		),
	],
);

export const accounts = pgTable(
	"accounts",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		platform: platforms().notNull(),
		// Discord user id, Farcaster FID, Twitter user id, etc.
		identifier: t.text().notNull(),
		user: t.uuid(),
	}),
	(t) => [
		unique("accounts_platform_identifier_unique").on(t.platform, t.identifier),
	],
);

export const escrows = pgTable(
	"escrows",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		// The account that, in the future, can claim the contents of this escrow to their user account that doesn't exist in the present
		heir: t.uuid().notNull(),
		community: t.uuid().notNull(),
		points: t
			.numeric({ precision: 38, scale: 18, mode: "number" })
			.notNull()
			.default(0),
		xp: t.bigint({ mode: "number" }).notNull().default(0),
		claimed: t.boolean().notNull().default(false),
	}),
	(t) => [unique("escrows_heir_community_unique").on(t.heir, t.community)],
);

export const articles = pgTable(
	"articles",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		title: t.text().notNull(),
		image: t.text().notNull(),
		content: t.jsonb().$type<TipTap>().notNull(),
		draft: t.boolean().notNull().default(true),
		publishedAt: t.timestamp("published_at", { mode: "date" }).notNull(),
		community: t.uuid().notNull(),
	}),
	(t) => [unique("articles_handle_community_unique").on(t.handle, t.community)],
);

export const events = pgTable(
	"events",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		name: t.text().notNull(),
		image: t.text().notNull(),
		description: t.text().notNull().default(""),
		start: t.timestamp({ mode: "date" }).notNull(),
		end: t.timestamp({ mode: "date" }).notNull(),
		community: t.uuid().notNull(),
		draft: t.boolean().notNull().default(true),
		featured: t.boolean().notNull().default(false),
		callToAction: t.jsonb("call_to_action").$type<{
			disabled: boolean;
			label: string;
			url: string;
		}>(),
		location: t.jsonb().$type<{
			name: string;
			url: string;
		}>(),
		details: t.jsonb().$type<TipTap>(),
		attendeeCount: t.integer("attendee_count"),
	}),
	(t) => [unique("events_handle_community_unique").on(t.handle, t.community)],
);

export const eventActions = pgTable("event_actions", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	event: t.uuid().notNull(),
	action: t.text().notNull(),
	description: t.jsonb().array().$type<ActionDescription>().notNull(),
	inputs: t
		.jsonb()
		.$type<{ [key: string]: { [key: string]: any } }>()
		.notNull(),
}));

export const stations = pgTable("stations", (t) => ({
	id: t.serial().primaryKey(),
	name: t.text().notNull(),
	event: t.text().notNull(),
	xp: t.integer().notNull(),
}));

export const checkpoints = pgTable(
	"checkpoints",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		community: t
			.uuid()
			.notNull()
			.default("98e09ea8-4c19-423c-9733-b946b6f70902"),
		key: t.text().notNull(),
		name: t.text().notNull(),
		event: t.uuid(),
		xp: t.integer(),
		gold: t.numeric({ precision: 38, scale: 18, mode: "number" }),
	}),
	(t) => [
		unique("checkpoints_handle_community_unique").on(t.handle, t.community),
	],
);

export const checkins = pgTable("checkins", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	checkpoint: t.uuid().notNull(),
	user: t.uuid(),
	timestamp: t.timestamp({ mode: "date" }).notNull().defaultNow(),
}));

export const predictions = pgTable(
	"predictions",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		event: t.uuid(),
		community: t.uuid().notNull(),
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
		pool: t
			.numeric({ precision: 38, scale: 18, mode: "number" })
			.notNull()
			.default(0),
	}),
	(t) => [
		unique("predictions_handle_community_unique").on(t.handle, t.community),
	],
);

export const outcomes = pgTable("outcomes", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	prediction: t.uuid().notNull(),
	name: t.text().notNull(),
	image: t.text(),
	result: t.boolean(),
	pool: t
		.numeric({ precision: 38, scale: 18, mode: "number" })
		.notNull()
		.default(0),
}));

export const bets = pgTable("bets", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	user: t.uuid().notNull(),
	outcome: t.uuid().notNull(),
	amount: t
		.numeric({ precision: 38, scale: 18, mode: "number" })
		.notNull()
		.default(0),
	prediction: t.uuid().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull().defaultNow(),
}));

export const attendees = pgTable(
	"attendees",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		event: t.uuid().notNull(),
		featured: t.boolean().notNull().default(false),
		user: t.uuid().notNull(),
	}),
	(t) => [unique("attendees_event_user_unique").on(t.event, t.user)],
);

export const rounds = pgTable(
	"rounds",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		name: t.text().notNull(),
		image: t.text().notNull(),
		community: t.uuid().notNull(),
		event: t.uuid(),
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
	}),
	(t) => [unique("rounds_handle_community_unique").on(t.handle, t.community)],
);

export const roundActions = pgTable("round_actions", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	round: t.uuid().notNull(),
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

// add user column and update it when they claim the award
export const awards = pgTable(
	"awards",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		round: t.uuid().notNull(),
		place: t.smallint().notNull(),
		asset: t.uuid().notNull(),
		value: t.numeric({ precision: 78, scale: 0 }).notNull(),
		claimed: t.boolean().notNull().default(false),
	}),
	(t) => [unique("awards_round_place_unique").on(t.round, t.place)],
);

// Rethink the way we handle awards and assets
export const assets = pgTable("assets", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	decimals: t.smallint(),
	chainId: t.integer("chain_id"),
	address: t.text(),
	tokenId: t.text("token_id"),
}));

export const proposals = pgTable("proposals", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	user: t.uuid().notNull(),
	round: t.uuid().notNull(),
	title: t.text().notNull(),
	content: t.text(), // rename to description
	image: t.text(),
	video: t.text(),
	url: t.text(),
	createdAt: t.timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
	hidden: t.boolean().notNull().default(false),
	published: t.boolean().notNull().default(true),
	winner: t.smallint(),
}));

export const nexus = pgTable("users", (t) => ({
	id: t.uuid().defaultRandom().primaryKey(),
	privyId: t.text("privy_id").notNull().unique(),
	admin: t.boolean().notNull().default(false),
	image: t.text().notNull().default(""),
	name: t.text().notNull().default(""),
	bio: t.text(),
	twitter: t.text(),
	discord: t.text(),
	fid: t.integer(),
	canRecieveEmails: t.boolean("can_recieve_emails").notNull().default(false),
}));

export const gold = pgTable(
	"points",
	(t) => ({
		id: t.uuid().defaultRandom().primaryKey(),
		community: t.uuid().notNull(),
		from: t.uuid(),
		fromEscrow: t.uuid(),
		to: t.uuid(),
		toEscrow: t.uuid(),
		amount: t.numeric({ precision: 38, scale: 18, mode: "number" }).notNull(),
		timestamp: t.timestamp({ mode: "date" }).notNull().defaultNow(),
		order: t.text(), // shopify DraftOrder gid
		checkin: t.uuid(),
		raffleEntry: t.uuid(),
		bet: t.uuid(),
		prediction: t.uuid(),
		quest: t.uuid(),
	}),
	(t) => [
		check(
			"from_or_to_or_fromEscrow_or_toEscrow_exists",
			sql`("from" IS NOT NULL OR "to" IS NOT NULL OR "fromEscrow" IS NOT NULL OR "toEscrow" IS NOT NULL)`,
		),
		check(
			"from_and_fromEscrow_not_both_present",
			sql`NOT ("from" IS NOT NULL AND "fromEscrow" IS NOT NULL)`,
		),
		check(
			"to_and_toEscrow_not_both_present",
			sql`NOT ("to" IS NOT NULL AND "toEscrow" IS NOT NULL)`,
		),
	],
);

export const quests = pgTable(
	"quests",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		name: t.text().notNull(),
		// TODO: Convert to string
		description: t.jsonb().$type<TipTap>(),
		image: t.text().notNull(),
		community: t.uuid().notNull(),
		event: t.uuid(),
		draft: t.boolean().notNull().default(true),
		createdAt: t
			.timestamp("created_at", { mode: "date" })
			.notNull()
			.defaultNow(),
		featured: t.boolean().notNull().default(false),
		active: t.boolean().notNull().default(false),
		start: t.timestamp({ mode: "date" }),
		end: t.timestamp({ mode: "date" }),
		xp: t.integer().notNull(),
		points: t
			.numeric({ precision: 38, scale: 18, mode: "number" })
			.notNull()
			.default(0),
	}),
	(t) => [
		unique("quests_handle_and_community_unique").on(t.handle, t.community),
	],
);

export const questActions = pgTable("quest_actions", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	quest: t.uuid().notNull(),
	action: t.text().notNull(),
	description: t.jsonb().array().$type<ActionDescription>().notNull(),
	inputs: t
		.jsonb()
		.$type<{ [key: string]: { [key: string]: any | undefined } }>()
		.notNull(),
}));

export const questCompletions = pgTable(
	"quest_completions",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		quest: t.uuid().notNull(),
		user: t.uuid().notNull(),
		timestamp: t.timestamp({ mode: "date" }).notNull().defaultNow(),
	}),
	(t) => [unique("quest_completions_quest_user_unique").on(t.quest, t.user)],
);

export const xp = pgTable("xp", (t) => ({
	id: t.uuid().defaultRandom().primaryKey(),
	user: t.uuid().notNull(),
	amount: t.bigint({ mode: "number" }).notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull().defaultNow(),
	quest: t.uuid(),
	snapshot: t.uuid(),
	station: t.integer(),
	checkin: t.uuid(),
	prediction: t.uuid(),
	vote: t.uuid(),
	proposal: t.uuid(),
	order: t.text(), // shopify Order gid
	raffleEntry: t.uuid(),
	attendee: t.uuid(),
	community: t.uuid().notNull(),
}));

export const leaderboards = pgTable(
	"passes",
	(t) => ({
		id: t.uuid().defaultRandom().primaryKey(),
		community: t.uuid().notNull(),
		user: t.uuid().notNull(),
		xp: t.bigint({ mode: "number" }).notNull().default(0),
		points: t
			.numeric({ precision: 38, scale: 18, mode: "number" })
			.notNull()
			.default(0),
		boosts: t.integer().notNull().default(0),
	}),
	(t) => [
		unique("passes_user_community_unique").on(t.user, t.community),
		index("passes_xp_idx").on(t.xp),
		index("passes_points_idx").on(t.points),
		index("passes_boosts_idx").on(t.boosts),
		check("points_balance", sql`${t.points} >= 0`),
	],
);

export const votes = pgTable("votes", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	user: t.uuid().notNull(),
	proposal: t.uuid().notNull(),
	round: t.uuid().notNull(),
	count: t.smallint().notNull(),
	timestamp: t.timestamp({ mode: "date" }).notNull().defaultNow(),
}));

export const products = pgTable(
	"products",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		shopifyId: t.text("shopify_id").notNull(),
		name: t.text().notNull(),
		description: t.jsonb().$type<TipTap>(),
		collection: t.uuid(),
		event: t.uuid(),
		community: t.uuid().notNull(),
		requiresShipping: t.boolean("requires_shipping").notNull(),
		active: t.boolean().notNull().default(true),
	}),
	(t) => [unique("products_handle_community_unique").on(t.handle, t.community)],
);

export const productVariants = pgTable("product_variants", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	product: t.uuid().notNull(),
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

export const collections = pgTable(
	"collections",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		community: t
			.uuid()
			.notNull()
			.default("98e09ea8-4c19-423c-9733-b946b6f70902"),
		name: t.text().notNull(),
		image: t.text().notNull(),
		featured: t.boolean().notNull().default(false),
	}),
	(t) => [
		unique("collections_handle_community_unique").on(t.handle, t.community),
	],
);

export const carts = pgTable(
	"carts",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		user: t.uuid().notNull(),
		product: t.uuid().notNull(),
		variant: t.uuid().notNull(),
		quantity: t.integer().notNull(),
	}),
	(t) => [
		unique("carts_user_product_variant_unique").on(
			t.user,
			t.product,
			t.variant,
		),
	],
);

export const raffles = pgTable(
	"raffles",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		name: t.text().notNull(),
		description: t.jsonb().$type<TipTap>().notNull(),
		images: t.text().array().notNull(),
		start: t.timestamp().notNull(),
		end: t.timestamp().notNull(),
		gold: t.integer().notNull(), // change to .numeric({ precision: 38, scale: 18, mode: "number" })
		winners: t.integer().notNull(),
		limit: t.integer(),
		event: t.uuid(),
		community: t.uuid().notNull(),
		draft: t.boolean().notNull().default(true),
		entryActions: t.text("entry_actions").array(),
		entryActionInputs: t
			.jsonb("entry_action_inputs")
			.array()
			.$type<Array<{ [key: string]: any }>>(),
	}),
	(t) => [unique("raffles_handle_community_unique").on(t.handle, t.community)],
);

export const raffleEntries = pgTable("raffle_entries", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	raffle: t.uuid().notNull(),
	user: t.uuid().notNull(),
	timestamp: t.timestamp().notNull().defaultNow(),
	amount: t.integer().notNull(),
	winner: t.boolean().notNull().default(false),
}));
