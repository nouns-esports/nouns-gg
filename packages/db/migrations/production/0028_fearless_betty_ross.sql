CREATE TABLE IF NOT EXISTS "articles" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image" text NOT NULL,
	"content" jsonb NOT NULL,
	"publishedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "nexus" ADD COLUMN "can_recieve_emails" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "image" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "rounds" ADD COLUMN "total_participants" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "round";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "quest";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "event";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN IF EXISTS "ranking";