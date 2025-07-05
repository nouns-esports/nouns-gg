"use server";

import { proposals, rounds } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { onlyUser } from ".";
import { z } from "zod";
import { getAction } from "../actions";
import { posthogClient } from "../clients/posthog";

export const createProposal = onlyUser
	.schema(
		z.object({
			round: z.string(),
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
				actions: true,
			},
		});

		if (!round) {
			throw new Error("Round not found");
		}

		if (round.proposals.length >= (round.maxProposals ?? Infinity)) {
			throw new Error(
				"You have reached the maximum number of proposals for this round",
			);
		}

		const actions = round.actions.filter(
			(action) => action.type === "proposing",
		);

		for (const actionState of actions) {
			const action = getAction({
				action: actionState.action,
			});

			if (!action) {
				throw new Error("Action not found");
			}

			const completed = await action.check({
				user: ctx.user,
				inputs: actionState.input,
			});

			if (actionState.required && !completed) {
				throw new Error("Proposing prerequisites not met");
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

		if (round.type === "url") {
			if (!parsedInput.url) {
				throw new Error("Url is required");
			}

			if (!parsedInput.image) {
				throw new Error("Cover image is required");
			}
		}

		let proposalId = "";

		await db.primary.transaction(async (tx) => {
			const [proposal] = await tx
				.insert(proposals)
				.values([
					{
						title: parsedInput.title,
						content: parsedInput.content,
						image: parsedInput.image,
						round: parsedInput.round,
						user: ctx.user.id,
						video: parsedInput.video,
						url: parsedInput.url,
						createdAt: now,
					},
				])
				.returning({
					id: proposals.id,
				});

			proposalId = proposal.id;
		});

		posthogClient.capture({
			event: "proposal-created",
			distinctId: ctx.user.id,
			properties: {
				round: round.id,
				proposal: proposalId,
				community: round.community,
			},
		});

		revalidatePath(`/rounds/${round.handle}`);
		revalidatePath(`/rounds/${round.handle}/propose`);
	});
