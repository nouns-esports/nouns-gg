"use server";

import { z } from "zod";
import { onlyUser } from ".";
import { proposals } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq } from "drizzle-orm";
import { roundState } from "@/utils/roundState";

export const hideProposal = onlyUser
	.schema(
		z.object({
			proposal: z.string(),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const proposal = await db.primary.query.proposals.findFirst({
			where: eq(proposals.id, parsedInput.proposal),
			with: {
				round: {
					with: {
						community: {
							with: {
								admins: true,
							},
						},
					},
				},
			},
		});

		if (!proposal) {
			throw new Error("Proposal not found");
		}

		if (
			!proposal.round.community.admins.some(
				(admin) => admin.user === ctx.user.id,
			)
		) {
			throw new Error("You are not an admin of this community");
		}

		const state = roundState(proposal.round);

		if (state !== "Proposing") {
			throw new Error("You can only hide proposals in the proposing phase");
		}

		await db.primary
			.update(proposals)
			.set({
				hidden: true,
				hiddenAt: new Date(),
			})
			.where(eq(proposals.id, parsedInput.proposal));
	});
