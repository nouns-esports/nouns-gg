import { onchainTable } from "ponder";

// SHould probably standardize these for all ERC721 holders
export const nouners = onchainTable("nouners", (t) => ({
	id: t.bigint().primaryKey(),
	owner: t.hex(),
}));
export const lilnouners = onchainTable("lilnouners", (t) => ({
	id: t.bigint().primaryKey(),
	owner: t.hex(),
}));

export const erc721Balances = onchainTable("erc721Balances", (t) => ({
	id: t.bigint().primaryKey(),
	owner: t.hex(),
}));

export const erc20Balances = onchainTable("erc20Balances", (t) => ({
	id: t.hex().primaryKey(),
	balance: t.bigint().notNull(),
}));

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
