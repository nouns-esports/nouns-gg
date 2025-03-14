"use server";

import { onlyUser } from ".";
import { notifications } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq } from "drizzle-orm";

export const readNotifications = onlyUser.action(async ({ ctx }) => {
	await db.primary
		.update(notifications)
		.set({ read: true })
		.where(eq(notifications.user, ctx.user.id));
});
