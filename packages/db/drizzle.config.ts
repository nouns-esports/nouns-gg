import type { Config } from "drizzle-kit";
import { env } from "~/env";

export default {
	dialect: "postgresql",
	schemaFilter: ["public"],
	// schema: "./schema.ts",
	schema: [
		"./schema/public.ts",
		// "./schema/indexer.ts", Can't be used with Drizzle Kit
		// "./schema/neynar.ts",
	],
	dbCredentials: {
		url: env.PRIMARY_DATABASE_URL, // Change to DATABASE_URL
	},
	// dbCredentials: {
	// 	url: env.DATABASE_URL, // Change to DATABASE_URL
	// },
} satisfies Config;
