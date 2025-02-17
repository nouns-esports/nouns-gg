CREATE TABLE IF NOT EXISTS "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"shopify_id" text NOT NULL,
	"customer" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"items" jsonb[] DEFAULT '{}' NOT NULL
);
