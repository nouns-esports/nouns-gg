import { z } from "zod";
import { createAction } from "../createAction";
import { events, attendees, communities } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, and } from "drizzle-orm";
import { createFilter } from "../createFilter";

export const signup = createAction({
	image: "",
	name: "Signup for Event",
	category: "events",
	generateDescription: async (inputs) => {
		"use server";

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
			});

			if (!event) throw new Error("Event not found");

			return [
				{ text: "Sign up for" },
				{ text: event.name, href: `/events/${event.handle}` },
			];
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
			});

			if (!community) throw new Error("Community not found");

			return [
				{ text: "Sign up for any event in" },
				{ text: community.name, href: `/c/${community.handle}` },
			];
		}

		return [{ text: "Sign up for any event" }];
	},
	check: async ({ inputs, user }) => {
		"use server";

		if (inputs.event) {
			const attendee = await db.primary.query.attendees.findFirst({
				where: and(
					eq(attendees.user, user.id),
					eq(attendees.event, inputs.event.id),
				),
			});

			return !!attendee;
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
				with: {
					events: {
						with: {
							attendees: {
								where: eq(attendees.user, user.id),
								limit: 1,
							},
						},
					},
				},
			});

			if (!community) return false;

			return community.events.some((event) => event.attendees.length > 0);
		}

		const attendee = await db.primary.query.attendees.findFirst({
			where: eq(attendees.user, user.id),
		});

		return !!attendee;
	},
	filters: {
		event: createFilter({
			options: {
				id: {
					name: "ID",
					description: "The event ID",
					schema: z.number(),
				},
			},
			name: "Event",
		}),
		community: createFilter({
			options: {
				id: {
					name: "ID",
					description: "The community ID",
					schema: z.string(),
				},
			},
			name: "Community",
		}),
	},
	validateInputs: async ({ inputs, ctx }) => {
		"use server";

		if (inputs.event && inputs.community) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify both event and community",
			});
		}
	},
});
