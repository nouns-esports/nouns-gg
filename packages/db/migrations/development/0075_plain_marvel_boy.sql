ALTER TABLE "orders" ADD COLUMN "shopify_id" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "shopify_id" bigint NOT NULL;