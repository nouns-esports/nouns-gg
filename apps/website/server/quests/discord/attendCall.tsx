import { and, eq } from "drizzle-orm";
import createAction from "../createAction";
import { snapshots, xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

export const attendCall = createAction<{ tag?: string }>(
	async (actionInputs) => {
		if (!actionInputs?.tag) {
			throw new Error("Tag input missing in action");
		}

		return {
			description: <p>Attend a Discord community call</p>,
			url: "/discord",
			check: async (user) => {
				if (!actionInputs.tag) return false;
				if (!user.discord) return false;

				const snapshot = await db.pgpool.query.snapshots.findFirst({
					where: and(
						eq(snapshots.user, user.id),
						eq(snapshots.type, "discord-call"),
						eq(snapshots.tag, actionInputs.tag),
					),
				});

				if (!snapshot) return false;

				return true;
			},
		};
	},
);
