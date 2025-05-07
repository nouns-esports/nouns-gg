import { createAction } from "../createAction";
import { z } from "zod";
import {
	communities,
	events,
	proposals,
	rounds,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, and } from "drizzle-orm";
import { createFilter } from "../createFilter";

export const createRoundProposal = createAction({
	image: "",
	name: "Create Proposal",
	category: "rounds",
	generateDescription: async (inputs) => {
		"use server";

		if (inputs.round) {
			const round = await db.primary.query.rounds.findFirst({
				where: eq(rounds.id, inputs.round.id),
			});

			if (!round) throw new Error("Round not found");

			return [
				{ text: "Create a proposal in" },
				{ text: round.name, href: `/rounds/${round.handle}` },
			];
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
			});

			if (!community) throw new Error("Community not found");

			return [
				{ text: "Create a proposal in any round in" },
				{ text: community.name, href: `/c/${community.handle}` },
			];
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
			});

			if (!event) throw new Error("Event not found");

			return [
				{ text: "Create a proposal in" },
				{ text: event.name, href: `/events/${event.handle}` },
			];
		}

		return [{ text: "Create a proposal in any round" }];
	},
	validateInputs: async ({ inputs, ctx }) => {
		"use server";

		if (inputs.round && inputs.community && inputs.event) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify all three: round, community, and event",
			});
		}

		if (inputs.round && inputs.community) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Round and community cannot both be provided",
			});
		}

		if (inputs.round && inputs.event) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Round and event cannot both be provided",
			});
		}

		if (inputs.community && inputs.event) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Community and event cannot both be provided",
			});
		}
	},
	check: async ({ user, inputs }) => {
		"use server";

		if (inputs.round) {
			const proposal = await db.primary.query.proposals.findFirst({
				where: eq(proposals.round, inputs.round.id),
				with: {
					round: true,
				},
			});

			return !!proposal;
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
				with: {
					rounds: {
						with: {
							proposals: {
								where: eq(proposals.user, user.id),
								limit: 1,
							},
						},
					},
				},
			});

			if (!community) return false;

			return community.rounds.some((round) => round.proposals.length > 0);
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
				with: {
					rounds: {
						with: {
							proposals: {
								where: eq(proposals.user, user.id),
								limit: 1,
							},
						},
					},
				},
			});

			if (!event) return false;

			return event.rounds.some((round) => round.proposals.length > 0);
		}

		const proposal = await db.primary.query.proposals.findFirst({
			where: eq(proposals.user, user.id),
		});

		return !!proposal;
	},
	filters: {
		round: createFilter({
			options: {
				id: { name: "ID", description: "The round ID", schema: z.number() },
			},
			name: "Round",
		}),
		community: createFilter({
			options: {
				id: { name: "ID", description: "The community ID", schema: z.number() },
			},
			name: "Community",
		}),
		event: createFilter({
			options: {
				id: { name: "ID", description: "The event ID", schema: z.number() },
			},
			name: "Event",
		}),
	},
});
