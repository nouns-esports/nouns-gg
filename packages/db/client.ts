import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "~/env";

import * as indexerSchema from "./schema/indexer";
import * as neynarSchema from "./schema/neynar";
import * as publicSchema from "./schema/public";

export const db = drizzle(env.PRIMARY_DATABASE_URL, {
	schema: {
		...indexerSchema,
		...neynarSchema,
		...publicSchema,
	},
});
