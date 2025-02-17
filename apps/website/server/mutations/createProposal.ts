"use server";

import { db, nexus, proposals, rounds, xp } from "~/packages/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { onlyUser } from ".";
import { z } from "zod";

export const createProposal = onlyUser
	.schema(
		z.object({
			title: z.string(),
			image: z.string().optional(),
			content: z.string(),
			round: z.string(),
			video: z.string().optional(),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const round = await db.query.rounds.findFirst({
			where: eq(rounds.id, parsedInput.round),
			with: {
				proposals: {
					where: eq(proposals.user, ctx.user.id),
				},
				minProposerRank: true,
			},
		});

		if (!round) {
			throw new Error("Round not found");
		}

		if (round.proposals[0]?.user === ctx.user.id) {
			throw new Error("You have already proposed for this round");
		}

		if (
			round.minProposerRank &&
			ctx.user.nexus?.rank &&
			ctx.user.nexus.rank.place < round.minProposerRank.place
		) {
			throw new Error("You are not eligible to propose in this round");
		}

		const now = new Date();
		const roundStart = new Date(round.start);
		const votingStart = new Date(round.votingStart);

		if (now < roundStart) {
			throw new Error("Round has not started yet");
		}

		if (now > votingStart) {
			throw new Error("Proposing has closed");
		}

		if (round.type === "image" && !parsedInput.image) {
			throw new Error("Image is required");
		}

		if (round.type === "video" && (!parsedInput.video || !parsedInput.image)) {
			throw new Error("Video and cover image is required");
		}

		await db.transaction(async (tx) => {
			const returnedProposal = await tx
				.insert(proposals)
				.values([
					{
						title: parsedInput.title,
						content: parsedInput.content,
						image: parsedInput.image,
						round: parsedInput.round,
						user: ctx.user.id,
						video: parsedInput.video,
						createdAt: now,
					},
				])
				.returning({ id: proposals.id });

			// Award 300 xp for proposing
			await tx.insert(xp).values({
				user: ctx.user.id,
				amount: 300,
				timestamp: now,
				proposal: returnedProposal[0].id,
			});

			await tx
				.update(nexus)
				.set({
					xp: sql`${nexus.xp} + 300`,
				})
				.where(eq(nexus.id, ctx.user.id));
		});

		revalidatePath(`/rounds/${parsedInput.round}`);
		revalidatePath(`/rounds/${parsedInput.round}/create`);
	});
