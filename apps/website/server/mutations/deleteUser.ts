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
		await privyClient.deleteUser(ctx.user.privyId);
		await db.primary
			.update(nexus)
			.set({
				name: "Deleted User",
				image:
					"https://ipfs.nouns.gg/ipfs/bafkreifznv3isngocvxcddhmtercz7qbs5vvu5adrdgvqjucl36ipfyh3m",
			})
			.where(eq(nexus.id, ctx.user.id));

		return true;
	} catch (e) {
		console.error("Error deleting user", e);
	}

	return false;
});
