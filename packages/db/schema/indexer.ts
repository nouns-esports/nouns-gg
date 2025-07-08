import type { JSONContent } from "@tiptap/react";
import { onchainTable, primaryKey } from "ponder";

export const erc721Balances = onchainTable(
	"erc721_balances",
	(t) => ({
		account: t.hex().notNull(),
		collection: t.text().notNull(),
		tokenId: t.bigint("token_id").notNull(),
	}),
	(t) => ({
		pk: primaryKey({ columns: [t.collection, t.tokenId] }),
	}),
);

export const nounDelegates = onchainTable("noun_delegates", (t) => ({
	from: t.hex().primaryKey(),
	to: t.hex().notNull(),
}));

export const lilnounDelegates = onchainTable("lilnoun_delegates", (t) => ({
	from: t.hex().primaryKey(),
	to: t.hex().notNull(),
}));

export const lilnounsVotes = onchainTable("lilnouns_votes", (t) => ({
	account: t.hex().primaryKey(),
	count: t.integer().notNull(),
}));

export const nounsVotingPower = onchainTable("nouns_voting_power", (t) => ({
	account: t.hex().primaryKey(),
	count: t.integer().notNull(),
}));

export const mntBalances = onchainTable("mnt_balances", (t) => ({
	account: t.hex().primaryKey(),
	count: t.integer().notNull(),
}));

export const cookBalances = onchainTable("cook_balances", (t) => ({
	account: t.hex().primaryKey(),
	count: t.integer().notNull(),
}));

export const nounsProposals = onchainTable("nouns_proposals", (t) => ({
	id: t.bigint().primaryKey(),
	proposer: t.hex().notNull(),
	targets: t.hex().array().notNull(),
	values: t.bigint().array().notNull(),
	signatures: t.text().array().notNull(),
	calldatas: t.hex().array().notNull(),
	description: t.jsonb().$type<JSONContent>().notNull(),
	createdAt: t.timestamp("created_at").notNull(),
	startTime: t.timestamp("start_time").notNull(),
	endTime: t.timestamp("end_time").notNull(),
	canceled: t.boolean().notNull(),
	vetoed: t.boolean().notNull(),
	quorum: t
		.jsonb()
		.$type<{
			min: number;
			current: number;
			max: number;
		}>()
		.notNull(),
	client: t.integer(),
	// TODO: Add state
}));

export const nounsVotes = onchainTable(
	"nouns_votes",
	(t) => ({
		proposal: t.bigint().notNull(),
		voter: t.hex().notNull(),
		support: t.smallint().notNull(),
		amount: t.bigint().notNull(),
		timestamp: t.timestamp().notNull(),
		reason: t.text(),
		client: t.integer(),
	}),
	(t) => ({
		pk: primaryKey({ columns: [t.proposal, t.voter] }),
	}),
);

export const voteReposts = onchainTable(
	"vote_reposts",
	(t) => ({
		proposal: t.bigint().notNull(),
		reposter: t.hex().notNull(),
		voter: t.hex().notNull(),
	}),
	(t) => ({
		pk: primaryKey({ columns: [t.proposal, t.reposter, t.voter] }),
	}),
);

export const nounsClients = onchainTable("nouns_clients", (t) => ({
	id: t.integer().primaryKey(),
	name: t.text().notNull(),
	url: t.text(),
}));

export const nouns = onchainTable("nouns", (t) => ({
	id: t.bigint().primaryKey(),
	background: t
		.text({
			enum: [
				"#d5d7e1", // 0
				"#e1d7d5", // 1
			],
		})
		.notNull(),
	body: t.text().notNull(),
	accessory: t.text().notNull(),
	head: t.text().notNull(),
	glasses: t.text().notNull(),
}));

export const nounsTraits = onchainTable("nouns_traits", (t) => ({
	id: t.text().primaryKey(),
	type: t.text({ enum: ["body", "accessory", "head", "glasses"] }).notNull(),
	index: t.integer().notNull(),
	image: t.text().notNull(),
	padding: t
		.jsonb()
		.$type<{
			left: number;
			top: number;
			right: number;
			bottom: number;
		}>()
		.notNull(),
}));

export const nounsAuctions = onchainTable("nouns_auctions", (t) => ({
	nounId: t.bigint("noun_id").primaryKey(),
	startTime: t.timestamp("start_time").notNull(),
	endTime: t.timestamp("end_time").notNull(),
	settled: t.boolean().notNull(),
	minBid: t.bigint("min_bid").notNull(),
}));

export const nounsBids = onchainTable(
	"nouns_bids",
	(t) => ({
		// TODO: Add winner
		nounId: t.bigint("noun_id").notNull(),
		bidder: t.hex().notNull(),
		amount: t.bigint().notNull(),
		timestamp: t.timestamp().notNull(),
		client: t.integer(),
	}),
	(t) => ({
		pk: primaryKey({ columns: [t.nounId, t.amount] }),
	}),
);
