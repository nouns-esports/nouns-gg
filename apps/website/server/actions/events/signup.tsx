import { z } from "zod";
import { createAction } from "../createAction";
import { events, attendees } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, and } from "drizzle-orm";

export const signup = createAction({
	schema: z.object({
		event: z.number().describe("The event to sign up for"),
	}),
	create: async (input) => {
		const event = await db.primary.query.events.findFirst({
			where: eq(events.id, input.event),
		});

		if (!event) {
			throw new Error("Event not found");
		}

		return {
			description: (
				<p>
					Sign up for <span className="text-red">{event.name}</span>
				</p>
			),
			url: `/events/${event.id}`,
			check: async (user) => {
				if (!event) return false;

				const attended = await db.primary.query.attendees.findFirst({
					where: and(
						eq(attendees.user, user.id),
						eq(attendees.event, event.id),
					),
				});

				if (!attended) return false;

				return true;
			},
		};
	},
});
