import {
	bigint,
	timestamp,
	text,
	varchar,
	jsonb,
	smallint,
	pgSchema,
} from "drizzle-orm/pg-core";
import { bytea } from "./custom/bytea";

const farcasterSchema = pgSchema("farcaster");

// https://docs.dune.com/data-catalog/community/farcaster/casts
export const farcasterCasts = farcasterSchema.table("dataset_farcaster_casts", {
	id: bigint({ mode: "number" }).primaryKey(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
	deletedAt: timestamp("deleted_at"),
	timestamp: timestamp(),
	fid: bigint({ mode: "number" }),
	hash: bytea(),
	parentHash: bytea("parent_hash"),
	parentFid: bigint("parent_fid", { mode: "number" }),
	parentUrl: varchar("parent_url"),
	text: text(),
	embeds: jsonb(),
	mentions: bigint({ mode: "number" }).array(),
	mentionsPositions: bigint("mentions_positions", { mode: "number" }).array(),
	rootParentHash: bytea("root_parent_hash"),
});

// https://docs.dune.com/data-catalog/community/farcaster/links
export const farcasterLinks = farcasterSchema.table("dataset_farcaster_links", {
	id: bigint({ mode: "number" }).primaryKey(),
	createdAt: timestamp("created_at"),
	updatedAt: timestamp("updated_at"),
	deletedAt: timestamp("deleted_at"),
	timestamp: timestamp(),
	fid: bigint({ mode: "number" }),
	targetFid: bigint("target_fid", { mode: "number" }),
	hash: bytea(),
	type: text(),
});

// https://docs.dune.com/data-catalog/community/farcaster/reactions
export const farcasterReactions = farcasterSchema.table(
	"dataset_farcaster_reactions",
	{
		id: bigint({ mode: "number" }).primaryKey(),
		createdAt: timestamp("created_at"),
		updatedAt: timestamp("updated_at"),
		deletedAt: timestamp("deleted_at"),
		timestamp: timestamp(),
		fid: bigint({ mode: "number" }),
		reactionType: smallint("reaction_type"),
		hash: bytea(),
		targetHash: bytea("target_hash"),
		targetFid: bigint("target_fid", { mode: "number" }),
		targetUrl: text("target_url"),
	},
);

// https://docs.dune.com/data-catalog/community/farcaster/profile_with_addresses
export const farcasterProfileWithAddresses = farcasterSchema.table(
	"dataset_farcaster_profile_with_addresses",
	{
		fid: bigint({ mode: "number" }).primaryKey(),
		fname: text(),
		displayName: text("display_name"),
		avatarUrl: text("avatar_url"),
		bio: text(),
		verifiedAddresses: jsonb("verified_addresses"),
	},
);
