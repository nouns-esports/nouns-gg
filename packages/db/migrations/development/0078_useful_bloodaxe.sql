ALTER TABLE "gold" ALTER COLUMN "to" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "gold" ADD COLUMN "order" bigint;