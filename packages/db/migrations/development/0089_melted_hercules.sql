CREATE INDEX "rankings_timestamp_idx" ON "rankings" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "rankings_user_idx" ON "rankings" USING btree ("user");--> statement-breakpoint
CREATE INDEX "rankings_score_idx" ON "rankings" USING btree ("score");