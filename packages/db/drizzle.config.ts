import type { Config } from "drizzle-kit";
import { env } from "~/env";

export default {
	dialect: "postgresql",
	schemaFilter: ["public"],
	schema: "./schema/public.ts",
	dbCredentials: {
		url: env.DATABASE_URL, // Change to DATABASE_URL
	},
} satisfies Config;
