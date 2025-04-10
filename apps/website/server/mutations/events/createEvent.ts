"use server";

import { onlyUser } from "..";
import { db } from "~/packages/db";
import { z } from "zod";
import { events } from "~/packages/db/schema/public";

export const createEvent = onlyUser
	.schema(
		z.object({
			handle: z.string(),
			name: z.string(),
			description: z.string(),
			image: z.string(),
			start: z.date(),
			end: z.date(),
			community: z.number(),
			location: z.object({
				name: z.string(),
				url: z.string(),
			}),
			callToAction: z.object({
				label: z.string(),
				url: z.string(),
				disabled: z.boolean().default(false),
			}),
			details: z.optional(z.record(z.string(), z.any())),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const now = new Date();

		if (parsedInput.start < now) {
			throw new Error("Start date must be in the future");
		}

		if (parsedInput.end < now) {
			throw new Error("End date must be in the future");
		}

		if (parsedInput.end <= parsedInput.start) {
			throw new Error("End date must be after start date");
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
			throw new Error("You are not an admin of this community");
		}

		if (!parsedInput.image.includes("ipfs.nouns.gg")) {
			throw new Error("Image must pinned to IPFS");
		}

		if (parsedInput.handle.length > 50) {
			throw new Error("Handle must be less than 50 characters");
		}

		if (parsedInput.name.length > 100) {
			throw new Error("Name must be less than 100 characters");
		}

		await db.primary.insert(events).values({
			handle: parsedInput.handle,
			name: parsedInput.name,
			description: parsedInput.description,
			image: parsedInput.image,
			start: parsedInput.start,
			end: parsedInput.end,
			community: parsedInput.community,
			location: parsedInput.location,
			callToAction: parsedInput.callToAction,
			details: parsedInput.details,
		});
	});
