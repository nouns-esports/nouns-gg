import { asc, desc, eq } from "drizzle-orm";
import { notifications } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

export async function getNotifications(input: { user: string }) {
	return db.query.notifications.findMany({
		where: eq(notifications.user, input.user),
		orderBy: desc(notifications.timestamp),
		limit: 10,
	});
}
