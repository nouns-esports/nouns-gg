ALTER TABLE "nexus" ADD COLUMN "gold" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "predictions" ADD COLUMN "closed" boolean DEFAULT false NOT NULL;