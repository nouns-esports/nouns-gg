"use server";

import { onlyUser } from "..";
import { db } from "~/packages/db";
import { z } from "zod";
import { rounds } from "~/packages/db/schema/public";

export const createRound = onlyUser
	.schema(
		z.object({
			handle: z.string(),
			type: z.union([
				z.literal("markdown"),
				z.literal("video"),
				z.literal("image"),
			]),
			name: z.string(),
			description: z.record(z.string(), z.any()),
			image: z.string(),
			start: z.date(),
			votingStart: z.date(),
			end: z.date(),
			community: z.number(),
			event: z.optional(z.number()),
			minProposerRank: z.optional(z.number()),
			minVoterRank: z.optional(z.number()),
			proposerCredential: z.optional(z.string()),
			voterCredential: z.optional(z.string()),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const now = new Date();

		if (parsedInput.start < now) {
			throw new Error("Start date must be in the future");
		}

		if (parsedInput.votingStart < now) {
			throw new Error("Voting start date must be in the future");
		}

		if (parsedInput.end < now) {
			throw new Error("End date must be in the future");
		}

		if (parsedInput.end <= parsedInput.votingStart) {
			throw new Error("End date must be after voting start date");
		}

		if (parsedInput.votingStart <= parsedInput.start) {
			throw new Error("Voting start date must be after start date");
		}

		if (parsedInput.end <= parsedInput.start) {
			throw new Error("End date must be after start date");
		}

		if (parsedInput.votingStart <= parsedInput.start) {
			throw new Error("Voting start date must be after start date");
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
			throw new Error("You are not an admin of this community");
		}

		if (parsedInput.event) {
			const event = await db.primary.query.events.findFirst({
				where: (events, { eq }) => eq(events.id, parsedInput.event!),
			});

			if (!event) {
				throw new Error(`Event ${parsedInput.event} not found`);
			}

			if (parsedInput.community && event.community !== parsedInput.community) {
				throw new Error("Event is not owned by this community");
			}
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

		await db.primary.transaction(async (tx) => {
			const round = await tx.insert(rounds).values({
				handle: parsedInput.handle,
				type: parsedInput.type,
				name: parsedInput.name,
				description: parsedInput.description,
				image: parsedInput.image,
				content: "",
				start: parsedInput.start,
				end: parsedInput.end,
				votingStart: parsedInput.votingStart,
				community: parsedInput.community,
				event: parsedInput.event,
				minProposerRank: parsedInput.minProposerRank,
				minVoterRank: parsedInput.minVoterRank,
				proposerCredential: parsedInput.proposerCredential,
				voterCredential: parsedInput.voterCredential,
			});
		});
	});
