ALTER TABLE "rankings" RENAME COLUMN "xp" TO "score";--> statement-breakpoint
ALTER TABLE "xp" ADD COLUMN "vote" integer;--> statement-breakpoint
ALTER TABLE "proposals" DROP COLUMN IF EXISTS "total_votes";--> statement-breakpoint
ALTER TABLE "rankings" DROP COLUMN IF EXISTS "diff";--> statement-breakpoint
ALTER TABLE "rounds" DROP COLUMN IF EXISTS "total_participants";