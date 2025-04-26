import { db } from "~/packages/db";
import { casts } from "~/packages/db/schema/farcaster";
import { eq, desc } from "drizzle-orm";

export async function getPosts() {
	return db.primary.query.casts.findMany({
		orderBy: desc(casts.timestamp),
		limit: 10,
		with: {
			creator: true,
		},
	});
}
