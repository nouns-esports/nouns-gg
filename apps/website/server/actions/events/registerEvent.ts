import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { attendees } from "~/packages/db/schema/public";

export const registerEvent = createAction({
	name: "registerEvent",
	schema: z.object({
		event: z
			.string()
			.uuid()
			.nullable()
			.describe("The event ID to register for"),
	}),
	check: async ({ user, input }) => {
		const attendee = await db.primary.query.attendees.findFirst({
			where: and(
				eq(attendees.user, user.id),
				input.event ? eq(attendees.event, input.event) : undefined,
			),
		});

		return !!attendee;
	},
});
