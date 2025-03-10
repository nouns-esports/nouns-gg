import { onchainTable, primaryKey, relations } from "ponder";

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
	"erc721_balances",
	(t) => ({
		tokenId: t.bigint("token_id").notNull(),
		account: t.hex().notNull(),
		collection: t.hex().notNull(),
	}),
	(t) => ({
		pk: primaryKey({ columns: [t.tokenId, t.collection] }),
	}),
);

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

export const nounDelegates = onchainTable("noun_delegates", (t) => ({
	from: t.hex().primaryKey(),
	to: t.hex().notNull(),
}));

export const nounDelegatesRelations = relations(nounDelegates, ({ one }) => ({
	delegatee: one(erc721Balances, {
		fields: [nounDelegates.from],
		references: [erc721Balances.account],
	}),
}));

export const lilnounDelegates = onchainTable("lilnoun_delegates", (t) => ({
	from: t.hex().primaryKey(),
	to: t.hex().notNull(),
}));

export const lilnounDelegatesRelations = relations(
	lilnounDelegates,
	({ one }) => ({
		delegatee: one(erc721Balances, {
			fields: [lilnounDelegates.from],
			references: [erc721Balances.account],
		}),
	}),
);

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
