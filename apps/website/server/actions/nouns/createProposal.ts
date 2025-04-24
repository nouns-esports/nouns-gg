import { db } from "~/packages/db";
import { createAction } from "../createAction";
import { nounsProposals } from "~/packages/db/schema/indexer";
import { inArray } from "drizzle-orm";

export const createNounsProposal = createAction({
	image: "",
	name: "Create Proposal",
	category: "nouns",
	generateDescription: async () => {
		"use server";

		return [
			{
				text: "Create a",
			},
			{
				text: "Nouns",
				link: "https://nouns.camp/?tab=proposals",
			},
			{
				text: "proposal",
			},
		];
	},
	check: async ({ user }) => {
		"use server";

		if (user.wallets.length === 0) return false;

		const proposal = await db.primary.query.nounsProposals.findFirst({
			where: inArray(
				nounsProposals.proposer,
				user.wallets.map((w) => w.address.toLowerCase() as `0x${string}`),
			),
		});

		return !!proposal;
	},
	filters: {
		// TODO: State filter (passed)
	},
});
