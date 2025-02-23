ALTER TABLE "gold" ADD COLUMN "amount" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "nexus" ADD COLUMN "gold" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "nexus" ADD CONSTRAINT "gold_balance" CHECK ("nexus"."gold" >= 0);