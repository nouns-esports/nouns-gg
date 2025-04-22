// "use server";

// import { onlyUser } from "..";
// import { db } from "~/packages/db";
// import { z } from "zod";
// import { quests } from "~/packages/db/schema/public";

// export const createQuest = onlyUser
// 	.schema(
// 		z.object({
// 			handle: z.string(),
// 			name: z.string(),
// 			description: z.record(z.string(), z.any()),
// 			image: z.string(),
// 			start: z.optional(z.date()),
// 			end: z.optional(z.date()),
// 			xp: z.number(),
// 			community: z.number(),
// 			event: z.optional(z.number()),
// 			actions: z.array(z.string()),
// 			actionInputs: z.array(z.record(z.string(), z.any())),
// 		}),
// 	)
// 	.action(async ({ parsedInput, ctx }) => {
// 		const now = new Date();

// 		if (parsedInput.start && parsedInput.start < now) {
// 			throw new Error("Start date must be in the future");
// 		}

// 		if (parsedInput.end && parsedInput.end < now) {
// 			throw new Error("End date must be in the future");
// 		}

// 		if (
// 			parsedInput.end &&
// 			parsedInput.start &&
// 			parsedInput.end <= parsedInput.start
// 		) {
// 			throw new Error("End date must be after start date");
// 		}

// 		const community = await db.primary.query.communities.findFirst({
// 			where: (communities, { eq }) =>
// 				eq(communities.id, parsedInput.community!),
// 			with: {
// 				admins: {
// 					where: (communityAdmins, { eq }) =>
// 						eq(communityAdmins.user, ctx.user.id),
// 				},
// 			},
// 		});

// 		if (!community) {
// 			throw new Error(`Community ${parsedInput.community} not found`);
// 		}

// 		if (!community.admins.some((admin) => admin.user === ctx.user.id)) {
// 			throw new Error("You are not an admin of this community");
// 		}

// 		if (parsedInput.event) {
// 			const event = await db.primary.query.events.findFirst({
// 				where: (events, { eq }) => eq(events.id, parsedInput.event!),
// 			});

// 			if (!event) {
// 				throw new Error(`Event ${parsedInput.event} not found`);
// 			}

// 			if (parsedInput.community && event.community !== parsedInput.community) {
// 				throw new Error("Event is not owned by this community");
// 			}
// 		}

// 		if (!parsedInput.image.includes("ipfs.nouns.gg")) {
// 			throw new Error("Image must pinned to IPFS");
// 		}

// 		if (parsedInput.xp < 0) {
// 			throw new Error("XP must be positive");
// 		}

// 		if (parsedInput.xp > 300) {
// 			throw new Error("XP must be less than 300");
// 		}

// 		if (
// 			parsedInput.actions.length === 0 ||
// 			parsedInput.actionInputs.length === 0
// 		) {
// 			throw new Error("Quest must have at least one action");
// 		}

// 		if (parsedInput.actionInputs.length !== parsedInput.actions.length) {
// 			throw new Error("Action inputs must match actions");
// 		}

// 		if (parsedInput.handle.length > 50) {
// 			throw new Error("Handle must be less than 50 characters");
// 		}

// 		if (parsedInput.name.length > 100) {
// 			throw new Error("Name must be less than 100 characters");
// 		}

// 		await db.primary.insert(quests).values({
// 			handle: parsedInput.handle,
// 			name: parsedInput.name,
// 			_description: parsedInput.description,
// 			description: "",
// 			image: parsedInput.image,
// 			start: parsedInput.start,
// 			end: parsedInput.end,
// 			xp: parsedInput.xp,
// 			community: parsedInput.community,
// 			event: parsedInput.event,
// 			actions: parsedInput.actions,
// 			actionInputs: parsedInput.actionInputs,
// 		});
// 	});
