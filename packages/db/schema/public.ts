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
import * as chains from "viem/chains";
import type { supportedChains } from "~/apps/website/server/clients/viem";

const platforms = () =>
	text({
		enum: ["discord", "farcaster", "twitter"],
	});

const plugins = () =>
	text({
		enum: [
			"discord",
			"farcaster",
			"twitter",
			"noundry",
			"dash",
			"lilnouns",
			"nouns",
			"ethereum",
			"quests",
			"rounds",
			"predictions",
			"raffles",
			"events",
			"shop",
		],
	});

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

export const communities = pgTable(
	"communities",
	(t) => ({
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
		}>(),
		agent: t.jsonb().$type<{
			context: string;
		}>(),
		createdAt: t.timestamp("created_at").notNull().defaultNow(),
		description: t.jsonb().$type<TipTap>(),
		parentUrl: t.text("parent_url"),
		details: t.jsonb().$type<TipTap>(),
		featured: t.boolean().notNull().default(false),
		embedding: t.vector({ dimensions: 1536 }),
	}),
	(t) => [
		index("communities_cosine_index").using(
			"hnsw",
			t.embedding.op("vector_cosine_ops"),
		),
	],
);

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

export const communityPlugins = pgTable("community_plugins", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	plugin: plugins().notNull(),
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

// export const charges = pgTable(
// 	"charges",
// 	(t) => ({
// 		id: t.uuid().primaryKey().defaultRandom(),
// 		user: t.uuid().notNull(),
// 		community: t.uuid().notNull(),
// 		payer: t.uuid().notNull(),
// 		count: t.integer().notNull(),
// 		timestamp: t.timestamp().notNull().defaultNow(),
// 		expires: t.timestamp().notNull(),
// 		renew: t.boolean().notNull(),
// 	}),
// 	(t) => [
// 		unique("charges_user_community_unique").on(t.user, t.community, t.payer),
// 		check("count_positive", sql`${t.count} > 0`),
// 	],
// );

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
		embedding: t.vector({ dimensions: 1536 }),
	}),
	(t) => [
		unique("articles_handle_community_unique").on(t.handle, t.community),
		index("articles_cosine_index").using(
			"hnsw",
			t.embedding.op("vector_cosine_ops"),
		),
	],
);

export const events = pgTable(
	"events",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		name: t.text().notNull(),
		image: t.text().notNull(),
		description: t.text().notNull().default(""),
		createdAt: t.timestamp("created_at").notNull().defaultNow(),
		deletedAt: t.timestamp("deleted_at"),
		start: t.timestamp({ mode: "date" }).notNull(),
		end: t.timestamp({ mode: "date" }).notNull(),
		community: t.uuid().notNull(),
		active: t.boolean().notNull().default(false),
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
		embedding: t.vector({ dimensions: 1536 }),
	}),
	(t) => [
		unique("events_handle_community_unique").on(t.handle, t.community),
		index("events_cosine_index").using(
			"hnsw",
			t.embedding.op("vector_cosine_ops"),
		),
	],
);

export const eventActions = pgTable("event_actions", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	event: t.uuid().notNull(),
	action: t.text().notNull(),
	plugin: plugins().notNull(),
	description: t.jsonb().array().$type<ActionDescription>().notNull(),
	input: t.jsonb().$type<{ [key: string]: { [key: string]: any } }>().notNull(),
}));

export const checkpoints = pgTable(
	"checkpoints",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		handle: t.text().notNull(),
		community: t.uuid().notNull(),
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
		active: t.boolean().notNull().default(false),
		name: t.text().notNull(),
		image: t.text().notNull(),
		rules: t.jsonb().$type<TipTap>().notNull(),
		xp: t
			.jsonb()
			.$type<{
				predicting: number;
				winning: number;
			}>()
			.notNull(),
		prizePool: t.integer().notNull(),
		closed: t.boolean().notNull().default(false),
		resolved: t.boolean().notNull().default(false),
		featured: t.boolean().notNull().default(false),
		createdAt: t.timestamp("created_at").notNull().defaultNow(),
		deletedAt: t.timestamp("deleted_at"),
		start: t.timestamp(),
		end: t.timestamp(),
		pool: t
			.numeric({ precision: 38, scale: 18, mode: "number" })
			.notNull()
			.default(0),
		embedding: t.vector({ dimensions: 1536 }),
	}),
	(t) => [
		unique("predictions_handle_community_unique").on(t.handle, t.community),
		index("predictions_cosine_index").using(
			"hnsw",
			t.embedding.op("vector_cosine_ops"),
		),
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
		active: t.boolean().notNull().default(false),
		type: t
			.text({ enum: ["markdown", "video", "image", "url"] })
			.notNull()
			.default("markdown"),
		featured: t.boolean().notNull().default(false),
		xp: t
			.jsonb()
			.$type<{
				// XP recieved for participating in proposing
				creatingProposal: number;
				// XP recieved for participating in voting
				castingVotes: number;
				// XP recieved per unique voter
				receivingVotes: number;
				// XP recieved for winning the round
				winning: number;
			}>()
			.notNull(),
		votingConfig: t
			.jsonb()
			.$type<
				{ purchaseLimit: number | null } & (
					| { mode: "fixed"; count: number }
					| { mode: "nouns"; block: number | null }
					| { mode: "lilnouns"; block: number | null }
					| { mode: "gnars"; block: number | null }
					| {
							mode: "nounish";
							nouns: {
								block: number | null;
								conversionRate: number;
							} | null;
							lilnouns: {
								block: number | null;
								conversionRate: number;
							} | null;
							gnars: {
								block: number | null;
								conversionRate: number;
							} | null;
					  }
					| {
							mode: "discord-roles";
							roles: Array<{
								id: string;
								server: string;
								count: number;
							}>;
					  }
					| { mode: "leaderboard" }
					| {
							mode: "token-weight";
							tokens: Array<
								| {
										type: "erc20";
										address: string;
										chain: keyof typeof supportedChains;
										decimals: number;
										block: number | null;
										minBalance: number;
										conversionRate: number;
								  }
								| {
										type: "erc721";
										address: string;
										chain: keyof typeof supportedChains;
										block: number | null;
										minBalance: number;
										conversionRate: number;
								  }
								| {
										type: "erc1155";
										address: string;
										chain: keyof typeof supportedChains;
										tokenId: number;
										block: number | null;
										minBalance: number;
										conversionRate: number;
								  }
							>;
					  }
				)
			>()
			.notNull(),
		content: t.text().notNull(),
		description: t.jsonb().$type<TipTap>(), //.notNull(),  tiptap migration
		createdAt: t.timestamp("created_at").notNull().defaultNow(),
		deletedAt: t.timestamp("deleted_at"),
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
		embedding: t.vector({ dimensions: 1536 }),
	}),
	(t) => [
		unique("rounds_handle_community_unique").on(t.handle, t.community),
		index("rounds_cosine_index").using(
			"hnsw",
			t.embedding.op("vector_cosine_ops"),
		),
	],
);

export const roundActions = pgTable("round_actions", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	round: t.uuid().notNull(),
	type: t
		.text({ enum: ["voting", "proposing"] })
		.notNull()
		.default("voting"),
	required: t.boolean().notNull().default(true),
	votes: t.integer().notNull().default(0),
	plugin: plugins().notNull(),
	action: t.text().notNull(),
	description: t.jsonb().array().$type<ActionDescription>().notNull(),
	input: t.jsonb().$type<{ [key: string]: any }>().notNull(),
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

export const proposals = pgTable(
	"proposals",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		user: t.uuid().notNull(),
		round: t.uuid().notNull(),
		title: t.text().notNull(),
		content: t.text(), // rename to description
		image: t.text(),
		video: t.text(),
		url: t.text(),
		createdAt: t
			.timestamp("created_at", { mode: "date" })
			.notNull()
			.defaultNow(),
		hiddenAt: t.timestamp("hidden_at", { mode: "date" }),
		deletedAt: t.timestamp("deleted_at", { mode: "date" }),
		winner: t.smallint(),
		embedding: t.vector({ dimensions: 1536 }),
	}),
	(t) => [
		index("proposals_cosine_index").using(
			"hnsw",
			t.embedding.op("vector_cosine_ops"),
		),
	],
);

export const nexus = pgTable("users", (t) => ({
	id: t.uuid().defaultRandom().primaryKey(),
	privyId: t.text("privy_id").notNull().unique(),
	image: t.text().notNull().default(""),
	name: t.text().notNull().default(""),
	bio: t.text(),
	twitter: t.text(),
	discord: t.text(),
	fid: t.integer(),
	canRecieveEmails: t.boolean("can_recieve_emails").notNull().default(false),
	deletedAt: t.timestamp("deleted_at", { mode: "date" }),
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
		for: t
			.text({
				enum: [
					// Predictions
					"WINNING_PREDICTION",
					"PLACING_PREDICTION",
					// Quests
					"COMPLETING_QUEST",
					// Raffles
					"ENTERING_RAFFLE",
					"WINNING_RAFFLE",
					// Shop
					"PLACING_ORDER",
					"REDEMPTION_DISCOUNT",
					// Checkins
					"CHECKING_IN",
					// Snapshot
					"SNAPSHOT",
					// Issuance
					"ENGAGEMENT_ACTIVITY",
					"GENERAL_ISSUANCE",
					// Transfer
					"USER_TRANSFER",
					// Claim
					"ESCROW_CLAIM",
					// Purchased Votes
					"PURCHASING_VOTES",
				],
			})
			.notNull(),
		order: t.uuid(),
		checkin: t.uuid(),
		checkpoint: t.uuid(),
		raffle: t.uuid(),
		raffleEntry: t.uuid(),
		bet: t.uuid(),
		prediction: t.uuid(),
		quest: t.uuid(),
		snapshot: t.uuid(),
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
		createdAt: t
			.timestamp("created_at", { mode: "date" })
			.notNull()
			.defaultNow(),
		deletedAt: t.timestamp("deleted_at"),
		featured: t.boolean().notNull().default(false),
		active: t.boolean().notNull().default(false),
		start: t.timestamp({ mode: "date" }),
		end: t.timestamp({ mode: "date" }),
		xp: t.integer().notNull(),
		points: t
			.numeric({ precision: 38, scale: 18, mode: "number" })
			.notNull()
			.default(0),
		embedding: t.vector({ dimensions: 1536 }),
	}),
	(t) => [
		unique("quests_handle_and_community_unique").on(t.handle, t.community),
		index("quests_cosine_index").using(
			"hnsw",
			t.embedding.op("vector_cosine_ops"),
		),
	],
);

export const questActions = pgTable("quest_actions", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	quest: t.uuid().notNull(),
	action: t.text().notNull(),
	plugin: plugins().notNull(),
	description: t.jsonb().array().$type<ActionDescription>().notNull(),
	input: t.jsonb().$type<{ [key: string]: any }>().notNull(),
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
	for: t
		.text({
			enum: [
				// Rounds
				"CASTING_VOTE",
				"RECEIVING_VOTE",
				"CREATING_PROPOSAL",
				"WINNING_ROUND",
				// Events
				"ATTENDING_EVENT",
				// Predictions
				"PLACING_PREDICTION",
				"WINNING_PREDICTION",
				// Quests
				"COMPLETING_QUEST",
				// Raffles
				"ENTERING_RAFFLE",
				"WINNING_RAFFLE",
				// Shop
				"PLACING_ORDER",
				// Shapshot
				"SNAPSHOT",
				// Checkins
				"CHECKING_IN",
				// Farcaster
				"FARCASTER_ACTIVITY",
				// Claim
				"ESCROW_CLAIM",
			],
		})
		.notNull(),
	quest: t.uuid(),
	snapshot: t.uuid(),
	checkin: t.uuid(),
	checkpoint: t.uuid(),
	prediction: t.uuid(),
	bet: t.uuid(),
	vote: t.uuid(),
	round: t.uuid(),
	proposal: t.uuid(),
	order: t.uuid(),
	raffle: t.uuid(),
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
	}),
	(t) => [
		unique("passes_user_community_unique").on(t.user, t.community),
		index("passes_xp_idx").on(t.xp),
		index("passes_points_idx").on(t.points),
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
		createdAt: t.timestamp("created_at").notNull().defaultNow(),
		deletedAt: t.timestamp("deleted_at"),
		community: t.uuid().notNull(),
		requiresShipping: t.boolean("requires_shipping").notNull(), // change to digital
		active: t.boolean().notNull().default(false),
		embedding: t.vector({ dimensions: 1536 }),
	}),
	(t) => [
		unique("products_handle_community_unique").on(t.handle, t.community),
		index("products_cosine_index").using(
			"hnsw",
			t.embedding.op("vector_cosine_ops"),
		),
	],
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
		community: t.uuid().notNull(),
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

export const orders = pgTable(
	"orders",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		draft: t.boolean().notNull().default(false),
		platform: t.text({ enum: ["shopify", "stripe"] }).notNull(),
		identifier: t.text().notNull().unique(),
		user: t.uuid().notNull(),
		community: t.uuid().notNull(),
		createdAt: t.timestamp("created_at").notNull().defaultNow(),
		spend: t
			.numeric({ precision: 38, scale: 18, mode: "number" })
			.notNull()
			.default(0),
	}),
	(t) => [
		unique("orders_platform_identifier_unique").on(t.platform, t.identifier),
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
		createdAt: t.timestamp("created_at").notNull().defaultNow(),
		deletedAt: t.timestamp("deleted_at"),
		gold: t.integer("cost").notNull(),
		xp: t
			.jsonb()
			.$type<{
				entering: number;
				winning: number;
			}>()
			.notNull(),
		winners: t.integer().notNull(),
		limit: t.integer(),
		event: t.uuid(),
		community: t.uuid().notNull(),
		active: t.boolean().notNull().default(false),
		embedding: t.vector({ dimensions: 1536 }),
	}),
	(t) => [
		unique("raffles_handle_community_unique").on(t.handle, t.community),
		index("raffles_cosine_index").using(
			"hnsw",
			t.embedding.op("vector_cosine_ops"),
		),
	],
);

export const raffleEntries = pgTable("raffle_entries", (t) => ({
	id: t.uuid().primaryKey().defaultRandom(),
	raffle: t.uuid().notNull(),
	user: t.uuid().notNull(),
	timestamp: t.timestamp().notNull().defaultNow(),
	amount: t.integer().notNull(),
	winner: t.boolean().notNull().default(false),
}));

export const purchasedVotes = pgTable(
	"purchased_votes",
	(t) => ({
		id: t.uuid().primaryKey().defaultRandom(),
		round: t.uuid().notNull(),
		user: t.uuid().notNull(),
		count: t.integer().notNull(),
		used: t.integer().notNull().default(0),
		timestamp: t.timestamp().notNull().defaultNow(),
	}),
	(t) => [
		unique("purchased_votes_user_round_unique").on(t.user, t.round),
		check("purchased_votes_used_le_count", sql`${t.used} <= ${t.count}`),
	],
);

// export const activity = pgTable("activity", (t) => ({
// 	id: t.uuid().primaryKey().defaultRandom(),
// 	identifier: t.text().notNull(), // Discord message id, Farcaster cast hash, Twitter tweet id
// 	user: t.uuid().notNull(),
// 	community: t.uuid().notNull(),
// 	platform: t.text({ enum: ["discord", "farcaster", "twitter"] }).notNull(),
// 	action: t.text({ enum: ["chat"] }).notNull(),
// 	timestamp: t.timestamp().notNull().defaultNow(),
// }));
