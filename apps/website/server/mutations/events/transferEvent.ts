"use server";

import { onlyUser } from "..";
import { db } from "~/packages/db";
import { z } from "zod";
import { events } from "~/packages/db/schema/public";
import { eq } from "drizzle-orm";

export const transferEvent = onlyUser
	.schema(
		z.object({
			event: z.number(),
			community: z.string(),
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

		if (
			event.community.admins.some(
				(admin) => admin.user === ctx.user.id && admin.owner,
			)
		) {
			throw new Error("You are not an owner of the event's current community");
		}

		const community = await db.primary.query.communities.findFirst({
			where: (communities, { eq }) =>
				eq(communities.id, parsedInput.community!),
			with: {
				admins: {
					where: (communityAdmins, { eq }) =>
						eq(communityAdmins.user, ctx.user.id),
				},
			},
		});

		if (!community) {
			throw new Error(`Community ${parsedInput.community} not found`);
		}

		if (!community.admins.some((admin) => admin.user === ctx.user.id)) {
			throw new Error("You are not an admin of the new community");
		}

		await db.primary
			.update(events)
			.set({
				community: parsedInput.community,
			})
			.where(eq(events.id, parsedInput.event!));
	});
