ALTER TABLE "rankings" ALTER COLUMN "rank" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rankings" ADD COLUMN "gold" integer;--> statement-breakpoint
ALTER TABLE "nexus" DROP COLUMN IF EXISTS "wallet";