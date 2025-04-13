"use server";

import { proposals, rounds } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { onlyUser } from ".";

export const updateProposal = onlyUser
	.schema(
		z.object({
			round: z.number(),
			title: z.string(),
			image: z.string().optional(),
			content: z.string().optional(),
			video: z.string().optional(),
			url: z.string().optional(),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const round = await db.primary.query.rounds.findFirst({
			where: eq(rounds.id, parsedInput.round),
			with: {
				proposals: {
					where: eq(proposals.user, ctx.user.id),
				},
			},
		});

		if (!round) {
			throw new Error("Round not found");
		}

		const proposal = round.proposals[0];

		if (!proposal) {
			throw new Error("You did not propose for this round");
		}

		const now = new Date();
		const votingStart = new Date(round.votingStart);

		if (now > votingStart) {
			throw new Error("Proposing has closed");
		}

		if (round.type === "markdown") {
			if (!parsedInput.content) {
				throw new Error("Content is required");
			}
		}

		if (round.type === "image") {
			if (!parsedInput.image) {
				throw new Error("Image is required");
			}
		}

		if (round.type === "video") {
			if (!parsedInput.video) {
				throw new Error("Video is required");
			}

			if (!parsedInput.image) {
				throw new Error("Cover image is required");
			}
		}

		if (round.type === "url") {
			if (!parsedInput.url) {
				throw new Error("Url is required");
			}

			if (!parsedInput.image) {
				throw new Error("Cover image is required");
			}
		}

		await db.primary
			.update(proposals)
			.set({
				title: parsedInput.title,
				content: parsedInput.content,
				image: parsedInput.image,
				video: parsedInput.video,
				url: parsedInput.url,
			})
			.where(eq(proposals.id, proposal.id));

		revalidatePath(`/rounds/${round.handle}`);
		revalidatePath(`/rounds/${round.handle}/propose`);
	});
