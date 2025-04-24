import { createAction } from "../createAction";
import { db } from "~/packages/db";
import { eq, and, inArray } from "drizzle-orm";
import { nounsProposals, nounsVotes } from "~/packages/db/schema/indexer";
import { z } from "zod";
import { createFilter } from "../createFilter";

export const castNounsVote = createAction({
	image: "",
	name: "Cast Vote",
	category: "nouns",
	generateDescription: async (inputs) => {
		"use server";

		if (inputs.proposal) {
			const proposal = await db.primary.query.nounsProposals.findFirst({
				where: eq(nounsProposals.id, BigInt(inputs.proposal.id)),
			});

			if (!proposal) throw new Error("Proposal not found");

			return [
				{ text: "Cast a vote on proposal" },
				{
					text: proposal.id.toString(),
					href: `https://nouns.camp/proposals/${proposal.id}`,
				},
			];
		}

		return [{ text: "Cast a vote on any Nouns proposal" }];
	},
	check: async ({ user, inputs }) => {
		"use server";

		if (user.wallets.length === 0) return false;

		const vote = await db.primary.query.nounsVotes.findFirst({
			where: and(
				inArray(
					nounsVotes.voter,
					user.wallets.map((w) => w.address.toLowerCase() as `0x${string}`),
				),
				inputs.proposal
					? eq(nounsVotes.proposal, BigInt(inputs.proposal.id))
					: undefined,
			),
		});

		return !!vote;
	},
	filters: {
		proposal: createFilter({
			options: {
				id: {
					name: "ID",
					description: "The proposal id",
					schema: z.number(),
				},
			},
			name: "Proposal",
		}),
	},
});
