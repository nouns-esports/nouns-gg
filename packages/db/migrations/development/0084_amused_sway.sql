ALTER TABLE "orders" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "gold" DROP COLUMN "order";--> statement-breakpoint
ALTER TABLE "xp" DROP COLUMN "order";