DROP TABLE "seasons";--> statement-breakpoint
ALTER TABLE "rankings" DROP COLUMN IF EXISTS "season";--> statement-breakpoint
ALTER TABLE "ranks" DROP COLUMN IF EXISTS "season";--> statement-breakpoint
ALTER TABLE "xp" DROP COLUMN IF EXISTS "season";