"use server";

import { env } from "~/env";
import { onlyUser } from ".";
import { z } from "zod";
import { privyClient } from "../clients/privy";
import { nexus } from "~/packages/db/schema/public";
import { eq } from "drizzle-orm";
import { db } from "~/packages/db";

export const deleteUser = onlyUser.action(async ({ ctx }) => {
	try {
		await privyClient.deleteUser(ctx.user.id);
		await db.primary.delete(nexus).where(eq(nexus.id, ctx.user.id));

		return true;
	} catch (e) {}

	return false;
});
