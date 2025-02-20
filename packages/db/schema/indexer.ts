import { onchainTable } from "ponder";

export const nouners = onchainTable("nouners", (t) => ({
	id: t.bigint().primaryKey(),
	owner: t.hex(),
}));

export const lilnouners = onchainTable("lilnouners", (t) => ({
	id: t.bigint().primaryKey(),
	owner: t.hex(),
}));

export const nounDelegates = onchainTable("nounDelegates", (t) => ({
	from: t.hex().primaryKey(),
	to: t.hex().notNull(),
}));

export const lilnounDelegates = onchainTable("lilnounDelegates", (t) => ({
	from: t.hex().primaryKey(),
	to: t.hex().notNull(),
}));
