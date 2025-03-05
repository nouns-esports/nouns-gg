import { attendees, events } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import createAction from "../createAction";
import { and, eq } from "drizzle-orm";

export const signup = createAction(async (actionInputs) => {
	if (!actionInputs.event) {
		throw new Error("Event input missing in action");
	}

	if (!actionInputs.url) {
		throw new Error("URL input missing in action");
	}

	const event = await db.query.events.findFirst({
		where: eq(events.id, actionInputs.event),
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
		url: actionInputs.url,
		check: async (user) => {
			if (!event) return false;

			const attended = await db.query.attendees.findFirst({
				where: and(eq(attendees.user, user.id), eq(attendees.event, event.id)),
			});

			if (!attended) return false;

			return true;
		},
	};
});
