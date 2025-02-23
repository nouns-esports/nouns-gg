import { onchainTable } from "ponder";

// SHould probably standardize these for all ERC721 holders
export const nouners = onchainTable("nouners", (t) => ({
	id: t.bigint().primaryKey(),
	owner: t.text(),
}));
export const lilnouners = onchainTable("lilnouners", (t) => ({
	id: t.bigint().primaryKey(),
	owner: t.text(),
}));

export const erc20Tokens = onchainTable("erc20Tokens", (t) => ({
	address: t.text().primaryKey(),
	symbol: t.text().notNull(),
	name: t.text().notNull(),
	image: t.text().notNull(),
	decimals: t.bigint().notNull(),
}));

export const erc721Tokens = onchainTable("erc721Tokens", (t) => ({
	address: t.text().primaryKey(),
	symbol: t.text().notNull(),
	name: t.text().notNull(),
	image: t.text().notNull(),
}));

export const erc721Balances = onchainTable("erc721Balances", (t) => ({
	wallet: t.text().primaryKey(),
	token: t.text().notNull(),
}));

export const erc20Balances = onchainTable("erc20Balances", (t) => ({
	wallet: t.text().primaryKey(),
	token: t.text().notNull(),
	balance: t.bigint().notNull(),
}));

export const nounDelegates = onchainTable("nounDelegates", (t) => ({
	from: t.text().primaryKey(),
	to: t.text().notNull(),
}));

export const lilnounDelegates = onchainTable("lilnounDelegates", (t) => ({
	from: t.text().primaryKey(),
	to: t.text().notNull(),
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
