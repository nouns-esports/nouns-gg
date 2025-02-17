ALTER TABLE "carts" ALTER COLUMN "variant" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "gold" ALTER COLUMN "order" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shopify_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "shopify_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "xp" ALTER COLUMN "order" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "draft" boolean DEFAULT true NOT NULL;