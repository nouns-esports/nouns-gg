import { onchainTable, primaryKey } from "ponder";

// export const erc20Tokens = onchainTable("erc20Tokens", (t) => ({
// 	address: t.hex().primaryKey(),
// 	symbol: t.text().notNull(),
// 	name: t.text().notNull(),
// 	image: t.text().notNull(),
// 	decimals: t.bigint().notNull(),
// }));

// export const erc721Tokens = onchainTable("erc721Tokens", (t) => ({
// 	address: t.hex().primaryKey(),
// 	name: t.text().notNull(),
// }));

export const erc721Balances = onchainTable(
	"erc721Balances",
	(t) => ({
		tokenId: t.bigint().notNull(),
		account: t.hex().notNull(),
		collection: t.hex().notNull(),
	}),
	(t) => ({
		pk: primaryKey({ columns: [t.tokenId, t.collection] }),
	}),
);

// export const erc721BalancesRelations = relations(erc721Balances, ({ one }) => ({
// 	collection: one(erc721Tokens, {
// 		fields: [erc721Balances.collection],
// 		references: [erc721Tokens.address],
// 	}),
// }));

// export const erc20Balances = onchainTable("erc20Balances", (t) => ({
// 	account: t.hex().primaryKey(),
// 	token: t.hex().notNull(),
// 	balance: t.bigint().notNull(),
// }));

// export const erc20BalancesRelations = relations(erc20Balances, ({ one }) => ({
// 	token: one(erc20Tokens, {
// 		fields: [erc20Balances.token],
// 		references: [erc20Tokens.address],
// 	}),
// }));

export const nounDelegates = onchainTable("nounDelegates", (t) => ({
	from: t.hex().primaryKey(),
	to: t.hex().notNull(),
}));

export const lilnounDelegates = onchainTable("lilnounDelegates", (t) => ({
	from: t.hex().primaryKey(),
	to: t.hex().notNull(),
}));

// export const nounsProposals = onchainTable("nounsProposals", (t) => ({
// 	id: t.bigint().primaryKey(),
// 	proposer: t.hex().notNull(),
// 	// Maybe its own table of nounsProposalTransactions
// 	targets: t.hex().array().notNull(),
// 	values: t.bigint().array().notNull(),
// 	signatures: t.text().array().notNull(),
// 	calldatas: t.hex().array().notNull(),
// 	description: t.text().notNull(),
// 	createdAt: t.timestamp().notNull(),
// 	startTime: t.timestamp().notNull(),
// 	endTime: t.timestamp().notNull(),
// }));

export const _ponder_meta = onchainTable("_ponder_meta", (t) => ({
	key: t.text().notNull(),
	value: t.jsonb().notNull(),
}));
