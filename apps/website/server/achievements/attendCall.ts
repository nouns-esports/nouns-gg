import { snapshots } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import type { AuthenticatedUser } from "../queries/users";
import { and, eq } from "drizzle-orm";

export default async function attendCall(user: AuthenticatedUser) {
	const snapshot = await db.query.snapshots.findFirst({
		where: and(eq(snapshots.user, user.id), eq(snapshots.type, "discord-call")),
	});

	if (snapshot) {
		return true;
	}

	return false;
}
