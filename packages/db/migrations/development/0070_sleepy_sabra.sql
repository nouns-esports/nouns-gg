CREATE TABLE IF NOT EXISTS "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" text NOT NULL,
	"product" text NOT NULL,
	"variant" text NOT NULL,
	"quantity" integer NOT NULL
);
