CREATE TABLE "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" text NOT NULL,
	"product" text NOT NULL,
	"variant" text NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gold" (
	"id" serial PRIMARY KEY NOT NULL,
	"from" text,
	"to" text,
	"amount" integer NOT NULL,
	"timestamp" timestamp NOT NULL,
	"ranking" integer,
	"order" text
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"shopify_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"images" text[] DEFAULT '{}' NOT NULL,
	"variants" jsonb[] DEFAULT '{}' NOT NULL,
	"collection" text
);
--> statement-breakpoint
ALTER TABLE "seasons" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "seasons" CASCADE;--> statement-breakpoint
ALTER TABLE "rankings" RENAME COLUMN "xp" TO "score";--> statement-breakpoint
ALTER TABLE "nexus" ADD COLUMN "gold" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "rankings" ADD COLUMN "gold" integer;--> statement-breakpoint
ALTER TABLE "ranks" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "xp" ADD COLUMN "vote" integer;--> statement-breakpoint
ALTER TABLE "xp" ADD COLUMN "proposal" integer;--> statement-breakpoint
ALTER TABLE "xp" ADD COLUMN "order" text;--> statement-breakpoint
ALTER TABLE "nexus" DROP COLUMN "wallet";--> statement-breakpoint
ALTER TABLE "proposals" DROP COLUMN "total_votes";--> statement-breakpoint
ALTER TABLE "rankings" DROP COLUMN "season";--> statement-breakpoint
ALTER TABLE "rankings" DROP COLUMN "diff";--> statement-breakpoint
ALTER TABLE "rankings" DROP COLUMN "position";--> statement-breakpoint
ALTER TABLE "ranks" DROP COLUMN "season";--> statement-breakpoint
ALTER TABLE "rounds" DROP COLUMN "total_participants";--> statement-breakpoint
ALTER TABLE "xp" DROP COLUMN "season";--> statement-breakpoint
ALTER TABLE "nexus" ADD CONSTRAINT "gold_balance" CHECK ("nexus"."gold" >= 0);