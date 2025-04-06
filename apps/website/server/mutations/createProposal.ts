"use server";

import { nexus, proposals, rounds, xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { onlyUser } from ".";
import { z } from "zod";
import { getUserHasCredential } from "../queries/users";

export const createProposal = onlyUser
	.schema(
		z.object({
			round: z.number(),
			title: z.string(),
			image: z.string().optional(),
			content: z.string().optional(),
			video: z.string().optional(),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const round = await db.primary.query.rounds.findFirst({
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

		if (round.proposerCredential) {
			const hasCredential = await getUserHasCredential({
				token: round.proposerCredential,
				wallets: ctx.user.wallets.map((w) => w.address as `0x${string}`),
			});

			if (!hasCredential) {
				throw new Error("You do not have a valid credential");
			}
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

		await db.primary.transaction(async (tx) => {
			await tx.insert(proposals).values([
				{
					title: parsedInput.title,
					content: parsedInput.content,
					image: parsedInput.image,
					round: parsedInput.round,
					user: ctx.user.id,
					video: parsedInput.video,
					createdAt: now,
				},
			]);
		});

		revalidatePath(`/rounds/${round.handle}`);
		revalidatePath(`/rounds/${round.handle}/propose`);
	});
