import "./patch/compression"; // BUG PATCH
import type { Config } from "drizzle-kit";
import { env } from "~/env";

export default {
	dialect: "postgresql",
	schemaFilter: ["public", "archive"],
	schema: "./schema/public.ts",
	dbCredentials: {
		url: env.PRIMARY_DATABASE_URL,
	},
} satisfies Config;
