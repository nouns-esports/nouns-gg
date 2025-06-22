import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";
import {
	communities,
	events,
	proposals,
	rounds,
	votes,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq } from "drizzle-orm";

export const castRoundVote = createAction({
	image: "",
	name: "Cast Vote",
	category: "rounds",
	generateDescription: async (inputs) => {
		"use server";

		if (inputs.round) {
			const round = await db.primary.query.rounds.findFirst({
				where: eq(rounds.id, inputs.round.id),
			});

			if (!round) throw new Error("Round not found");

			return [
				{ text: "Cast a vote in" },
				{ text: round.name, href: `/rounds/${round.handle}` },
			];
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
			});

			if (!community) throw new Error("Community not found");

			return [
				{ text: "Cast a vote in any round in" },
				{ text: community.name, href: `/c/${community.handle}` },
			];
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
			});

			if (!event) throw new Error("Event not found");

			return [
				{ text: "Cast a vote in any round in" },
				{ text: event.name, href: `/events/${event.handle}` },
			];
		}

		if (inputs.proposal) {
			const proposal = await db.primary.query.proposals.findFirst({
				where: eq(proposals.id, inputs.proposal.id),
				with: {
					round: true,
				},
			});

			if (!proposal) throw new Error("Proposal not found");

			return [
				{ text: "Cast a vote on" },
				{
					text: proposal.title,
					href: `/rounds/${proposal.round.handle}?p=${proposal.id}`,
				},
			];
		}

		return [{ text: "Cast a vote in any round" }];
	},
	check: async ({ user, inputs }) => {
		"use server";

		if (inputs.round) {
			const vote = await db.primary.query.votes.findFirst({
				where: and(eq(votes.user, user.id), eq(votes.round, inputs.round.id)),
			});

			return !!vote;
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
				with: {
					rounds: {
						with: {
							votes: {
								where: eq(votes.user, user.id),
								limit: 1,
							},
						},
					},
				},
			});

			if (!community) return false;

			return community.rounds.some((round) => round.votes.length > 0);
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
				with: {
					rounds: {
						with: {
							votes: {
								where: eq(votes.user, user.id),
								limit: 1,
							},
						},
					},
				},
			});

			if (!event) return false;

			return event.rounds.some((round) => round.votes.length > 0);
		}

		if (inputs.proposal) {
			const vote = await db.primary.query.votes.findFirst({
				where: and(
					eq(votes.user, user.id),
					eq(votes.proposal, inputs.proposal.id),
				),
			});

			if (!vote) return false;

			return true;
		}

		const vote = await db.primary.query.votes.findFirst({
			where: eq(votes.user, user.id),
		});

		return !!vote;
	},
	validateInputs: async ({ inputs, ctx }) => {
		"use server";

		if (inputs.round && inputs.community && inputs.proposal) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify all three: round, community, and proposal",
			});
		}

		if (inputs.round && inputs.community) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify both round and community",
			});
		}

		if (inputs.round && inputs.proposal) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify both round and proposal",
			});
		}

		if (inputs.community && inputs.proposal) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify both community and proposal",
			});
		}
	},
	filters: {
		round: createFilter({
			options: {
				id: { name: "ID", description: "The round ID", schema: z.string() },
			},
			name: "Round",
		}),
		community: createFilter({
			options: {
				id: { name: "ID", description: "The community ID", schema: z.string() },
			},
			name: "Community",
		}),
		proposal: createFilter({
			options: {
				id: { name: "ID", description: "The proposal ID", schema: z.string() },
			},
			name: "Proposal",
		}),
		event: createFilter({
			options: {
				id: { name: "ID", description: "The event ID", schema: z.string() },
			},
			name: "Event",
		}),
	},
});
