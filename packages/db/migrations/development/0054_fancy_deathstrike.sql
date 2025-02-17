CREATE TABLE IF NOT EXISTS "collections" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gold" (
	"id" serial PRIMARY KEY NOT NULL,
	"from" text,
	"to" text NOT NULL,
	"amount" integer NOT NULL,
	"timestamp" timestamp NOT NULL,
	"ranking" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL,
	"variants" jsonb[] DEFAULT '{}' NOT NULL,
	"collection" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variants" (
	"id" text PRIMARY KEY NOT NULL,
	"product" text NOT NULL,
	"variant_id" integer NOT NULL,
	"type" text NOT NULL,
	"value" text NOT NULL,
	"image" text NOT NULL,
	"price" numeric(78) NOT NULL,
	"inventory" integer NOT NULL
);
