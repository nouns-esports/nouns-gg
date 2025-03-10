import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "~/env";
import { Table, is } from "drizzle-orm";

import * as _indexerSchema from "./schema/indexer";
// import * as farcasterSchema from "./schema/farcaster";
import * as publicSchema from "./schema/public";

const setDatabaseSchema = <T extends { [name: string]: unknown }>(
	schema: T,
	schemaName: string,
): T => {
	for (const table of Object.values(schema)) {
		if (is(table, Table)) {
			// @ts-ignore
			table[Symbol.for("drizzle:Schema")] = schemaName;
		}
	}
	return schema;
};

const indexerSchema = setDatabaseSchema(
	_indexerSchema,
	env.RAILWAY_DEPLOYMENT_ID,
);

export const db = drizzle(env.DATABASE_URL, {
	schema: {
		...indexerSchema,
		// ...farcasterSchema,
		...publicSchema,
	},
});
