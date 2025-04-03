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
			community: z.union([z.number(), z.null()]),
			creator: z.union([z.string(), z.null()]),
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

		const removingCommunity = parsedInput.community === null;
		const removingCreator = parsedInput.creator === null;
		const transferringToCommunity = typeof parsedInput.community === "number";
		const transferringToCreator = typeof parsedInput.creator === "string";

		if (transferringToCommunity && transferringToCreator) {
			throw new Error(
				"Events can't be owned by both a creator and a community",
			);
		}

		if (removingCommunity && removingCreator) {
			throw new Error(
				"Events must be owned by either a creator or a community",
			);
		}

		if (transferringToCommunity && !removingCreator) {
			throw new Error(
				"When transferring to a community, creator must be set to null",
			);
		}

		if (transferringToCreator && !removingCommunity) {
			throw new Error(
				"When transferring to a creator, community must be set to null",
			);
		}

		if (transferringToCommunity && event.creator && !removingCreator) {
			throw new Error(
				"You can't transfer ownership of an event to a community if it's owned by a creator",
			);
		}

		if (transferringToCreator && event.community && !removingCommunity) {
			throw new Error(
				"You can't transfer ownership of an event to a creator if it's owned by a community",
			);
		}

		if (transferringToCommunity) {
			if (
				event.community &&
				!event.community.admins.some(
					(admin) => admin.user === ctx.user.id && admin.owner,
				)
			) {
				throw new Error(
					"You are not an owner of the event's current community",
				);
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
				throw new Error("Community not found");
			}

			if (!community.admins.some((admin) => admin.user === ctx.user.id)) {
				throw new Error("You are not an admin of the new community");
			}
		}

		if (transferringToCreator) {
			if (event.creator && event.creator !== ctx.user.id) {
				throw new Error("You are not the creator of this event");
			}
		}

		await db.primary
			.update(events)
			.set({
				community: transferringToCommunity ? parsedInput.community : null,
				creator: transferringToCreator ? parsedInput.creator : null,
			})
			.where(eq(events.id, parsedInput.event!));
	});
