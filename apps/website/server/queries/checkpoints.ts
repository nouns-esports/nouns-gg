"use server";

import { checkins, checkpoints } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq } from "drizzle-orm";

export async function getCheckpoint(input: { key: string; user?: string }) {
	return db.pgpool.query.checkpoints.findFirst({
		where: eq(checkpoints.key, input.key),
		with: {
			event: true,
			checkins: {
				where: input.user ? eq(checkins.user, input.user) : undefined,
				limit: 1,
			},
		},
	});
}
