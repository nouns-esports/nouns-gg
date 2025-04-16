import { and, eq } from "drizzle-orm";
import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { snapshots } from "~/packages/db/schema/public";

export const attendCall = createAction({
	create: async () => {
		return {
			description: <p>Attend a Discord community call</p>,
			url: "/discord",
			check: async (user) => {
				const snapshot = await db.pgpool.query.snapshots.findFirst({
					where: and(
						eq(snapshots.user, user.id),
						eq(snapshots.type, "discord-call"),
					),
				});

				if (snapshot) {
					return true;
				}

				return false;
			},
		};
	},
});
