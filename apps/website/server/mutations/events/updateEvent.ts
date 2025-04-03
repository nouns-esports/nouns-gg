"use server";

import { onlyUser } from "..";
import { db } from "~/packages/db";
import { z } from "zod";
import { events } from "~/packages/db/schema/public";
import { eq } from "drizzle-orm";

export const updateEvent = onlyUser
	.schema(
		z.object({
			event: z.number(),
			handle: z.optional(z.string()),
			name: z.optional(z.string()),
			description: z.optional(z.string()),
			image: z.optional(z.string()),
			start: z.optional(z.date()),
			end: z.optional(z.date()),
			location: z.optional(
				z.object({
					name: z.string(),
					url: z.string(),
				}),
			),
			callToAction: z.optional(
				z.object({
					label: z.string(),
					url: z.string(),
					disabled: z.boolean().default(false),
				}),
			),
			details: z.optional(z.union([z.record(z.string(), z.any()), z.null()])),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const event = await db.primary.query.events.findFirst({
			where: (events, { eq }) => eq(events.id, parsedInput.event!),
			with: {
				community: {
					with: {
						admins: true,
					},
				},
			},
		});

		if (!event) {
			throw new Error("Event not found");
		}

		const now = new Date();

		if (parsedInput.start && parsedInput.start < now) {
			throw new Error("Start date must be in the future");
		}

		if (parsedInput.end && parsedInput.end < now) {
			throw new Error("End date must be in the future");
		}

		if (
			parsedInput.end &&
			parsedInput.start &&
			parsedInput.end <= parsedInput.start
		) {
			throw new Error("End date must be after start date");
		}

		if (
			event.community &&
			!event.community.admins.some((admin) => admin.user === ctx.user.id)
		) {
			throw new Error("You are not an admin of the event's community");
		}

		if (event.creator && event.creator !== ctx.user.id) {
			throw new Error("You are not the creator of this event");
		}

		if (parsedInput.image && !parsedInput.image.includes("ipfs.nouns.gg")) {
			throw new Error("Image must pinned to IPFS");
		}

		await db.primary
			.update(events)
			.set({
				handle: parsedInput.handle,
				name: parsedInput.name,
				description: parsedInput.description,
				image: parsedInput.image,
				start: parsedInput.start,
				end: parsedInput.end,
				location: parsedInput.location,
				callToAction: parsedInput.callToAction,
				details: parsedInput.details,
			})
			.where(eq(events.id, parsedInput.event));
	});
