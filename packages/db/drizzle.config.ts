import type { Config } from "drizzle-kit";
import { env } from "~/env";

export default {
	dialect: "postgresql",
	schema: "./schema.ts",
	// schema: [
	// 	"./schema/public.ts",
	// 	"./schema/indexer.ts",
	// 	"./schema/neynar.ts",
	// 	"./schema/dash.ts",
	// ],
	out: `./migrations/${env.NEXT_PUBLIC_ENVIRONMENT}`,
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	// dbCredentials: {
	// 	url: env.PGPOOL_URL,
	// },
	schemaFilter: ["public"],
} satisfies Config;
