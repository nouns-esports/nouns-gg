ALTER TABLE "nexus" DROP CONSTRAINT "gold_balance";--> statement-breakpoint
ALTER TABLE "gold" DROP COLUMN "amount";--> statement-breakpoint
ALTER TABLE "nexus" DROP COLUMN "gold";