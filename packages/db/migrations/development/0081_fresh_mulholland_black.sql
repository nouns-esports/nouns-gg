ALTER TABLE "nexus" ADD CONSTRAINT "gold_balance" CHECK ("nexus"."gold" >= 0);