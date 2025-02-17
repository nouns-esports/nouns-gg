ALTER TABLE "orders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "orders" CASCADE;--> statement-breakpoint
ALTER TABLE "gold" ALTER COLUMN "order" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "xp" ALTER COLUMN "order" SET DATA TYPE text;