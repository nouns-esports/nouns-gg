import {
	bigint,
	timestamp,
	text,
	jsonb,
	smallint,
	pgSchema,
	uuid,
	real,
} from "drizzle-orm/pg-core";
import { bytea } from "./custom/bytea";
import { relations } from "drizzle-orm";

const farcasterSchema = pgSchema("farcaster_v3");

export const casts = farcasterSchema.table("casts", {
	id: uuid("id").primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	deletedAt: timestamp("deleted_at"),
	timestamp: timestamp().notNull(),
	fid: bigint({ mode: "number" }).notNull(),
	hash: bytea().notNull(),
	text: text().notNull(),
	parentHash: bytea("parent_hash"),
	parentFid: bigint("parent_fid", { mode: "number" }),
	parentUrl: text("parent_url"),
	rootParentHash: bytea("root_parent_hash").notNull(),
	rootParentUrl: text("root_parent_url"),
	embeddedUrls: text("embedded_urls").array(),
	embeddedCasts: bytea("embedded_casts").array(),
	mentions: bigint("mentions", { mode: "number" }).array(),
	mentionsPositions: smallint("mentions_positions").array(),
	tickerMentions: text("ticker_mentions").array(),
	tickerMentionsPositions: smallint("ticker_mentions_positions").array(),
	channelMentions: text("channel_mentions").array(),
	channelMentionsPositions: smallint("channel_mentions_positions").array(),
	embeddedCastsFids: bigint("embedded_casts_fids", { mode: "number" }).array(),
	embeds:
		jsonb("embeds").$type<
			Array<{
				url: string;
			}>
		>(),
	creatorAppFid: bigint("creator_app_fid", { mode: "number" }),
	deleterAppFid: bigint("deleter_app_fid", { mode: "number" }),
});

export const profiles = farcasterSchema.table("profiles", {
	id: uuid("id").primaryKey().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	deletedAt: timestamp("deleted_at"),
	fid: bigint({ mode: "number" }).notNull(),
	bio: text(),
	pfpUrl: text("pfp_url"),
	url: text(),
	username: text(),
	displayName: text("display_name"),
	location: text(),
	latitude: real(),
	longitude: real(),
	primaryEthAddress: bytea("primary_eth_address"),
	primarySolAddress: bytea("primary_sol_address"),
});

export const follows = farcasterSchema.table("follows", {
	id: uuid("id").primaryKey(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
	deletedAt: timestamp("deleted_at"),
	timestamp: timestamp(),
	fid: bigint({ mode: "number" }),
	targetFid: bigint("target_fid", { mode: "number" }),
	displayTimestamp: timestamp("display_timestamp"),
});

export const reactions = farcasterSchema.table("reactions", {
	id: uuid("id").primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	deletedAt: timestamp("deleted_at"),
	timestamp: timestamp().notNull(),
	reactionType: smallint("reaction_type").notNull(),
	fid: bigint({ mode: "number" }).notNull(),
	targetHash: bytea("target_hash"),
	targetFid: bigint("target_fid", { mode: "number" }),
	targetUrl: text("target_url"),
});

export const verifications = farcasterSchema.table("verifications", {
	id: uuid("id").primaryKey(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	deletedAt: timestamp("deleted_at"),
	timestamp: timestamp().notNull(),
	address: bytea("address").notNull(),
	fid: bigint({ mode: "number" }).notNull(),
	protocol: smallint("protocol").notNull(),
});
