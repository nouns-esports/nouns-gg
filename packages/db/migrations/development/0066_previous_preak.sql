DROP TABLE "variants";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "shopify_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "product_id";