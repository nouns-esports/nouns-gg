import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";
import { db } from "~/packages/db";
import {
	communities,
	events,
	proposals,
	rounds,
	votes,
} from "~/packages/db/schema/public";
import { eq, sql } from "drizzle-orm";

export const recieveVotes = createAction({
	image: "",
	name: "Recieve Votes",
	category: "rounds",
	generateDescription: async (inputs) => {
		"use server";

		if (inputs.round) {
			const round = await db.primary.query.rounds.findFirst({
				where: eq(rounds.id, inputs.round.id),
			});

			if (!round) throw new Error("Round not found");

			const amount = inputs.amount ? inputs.amount.min : 1;

			if (amount > 1) {
				return [
					{
						text: `Recieve at least ${amount} votes in`,
						highlight: true,
					},
					{ text: round.name, href: `/rounds/${round.handle}` },
				];
			}

			return [
				{
					text: "Recieve a vote in",
				},
				{ text: round.name, href: `/rounds/${round.handle}` },
			];
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
			});

			if (!community) throw new Error("Community not found");

			const amount = inputs.amount ? inputs.amount.min : 1;

			if (amount > 1) {
				return [
					{ text: "Recieve at least" },
					{ text: amount.toString(), highlight: true },
					{ text: "votes in any round in" },
					{ text: community.name, href: `/c/${community.handle}` },
				];
			}

			return [
				{ text: "Recieve a vote in any round in" },
				{ text: community.name, href: `/c/${community.handle}` },
			];
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
			});

			if (!event) throw new Error("Event not found");

			const amount = inputs.amount ? inputs.amount.min : 1;

			if (amount > 1) {
				return [
					{ text: "Recieve at least" },
					{ text: amount.toString(), highlight: true },
					{ text: "votes in any round in" },
					{ text: event.name, href: `/events/${event.handle}` },
				];
			}

			return [
				{ text: "Recieve a vote in any round in" },
				{ text: event.name, href: `/events/${event.handle}` },
			];
		}

		return [{ text: "Recieve votes in any round" }];
	},
	check: async ({ user, inputs }) => {
		"use server";

		if (inputs.round) {
			const proposal = await db.primary.query.proposals.findFirst({
				where: eq(proposals.round, inputs.round.id),
				extras: {
					totalVotes: sql<number>`(
						SELECT COALESCE(SUM(v.count), 0) AS total_votes
						FROM ${votes} v 
						WHERE v.proposal = ${proposals.id}
					)`.as("totalVotes"),
				},
			});

			if (!proposal) return false;

			const min = inputs.amount ? inputs.amount.min : 1;

			if (proposal.totalVotes >= min) return true;

			return false;
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
				with: {
					rounds: {
						with: {
							proposals: {
								where: eq(proposals.user, user.id),
								extras: {
									totalVotes: sql<number>`(
											SELECT COALESCE(SUM(v.count), 0) AS total_votes
									FROM ${votes} v 
									WHERE v.proposal = ${proposals.id}
								)`.as("totalVotes"),
								},
							},
						},
					},
				},
			});

			if (!community) return false;

			const min = inputs.amount ? inputs.amount.min : 1;

			if (
				community.rounds.some((round) =>
					round.proposals.some((proposal) => proposal.totalVotes >= min),
				)
			) {
				return true;
			}

			return false;
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
				with: {
					rounds: {
						with: {
							proposals: {
								where: eq(proposals.user, user.id),
								extras: {
									totalVotes: sql<number>`(
										SELECT COALESCE(SUM(v.count), 0) AS total_votes
										FROM ${votes} v 
										WHERE v.proposal = ${proposals.id}
									)`.as("totalVotes"),
								},
							},
						},
					},
				},
			});

			if (!event) return false;

			const min = inputs.amount ? inputs.amount.min : 1;

			if (
				event.rounds.some((round) =>
					round.proposals.some((proposal) => proposal.totalVotes >= min),
				)
			) {
				return true;
			}

			return false;
		}

		const userProposals = await db.primary.query.proposals.findMany({
			where: eq(proposals.user, user.id),
			extras: {
				totalVotes: sql<number>`(
					SELECT COALESCE(SUM(v.count), 0) AS total_votes
				)`.as("totalVotes"),
			},
		});

		const min = inputs.amount ? inputs.amount.min : 1;

		if (userProposals.some((proposal) => proposal.totalVotes >= min)) {
			return true;
		}

		return false;
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
				message: "Cannot specify both round and community",
			});
		}

		if (inputs.round && inputs.event) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify both round and event",
			});
		}

		if (inputs.community && inputs.event) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify both community and event",
			});
		}
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
		amount: createFilter({
			options: {
				min: {
					name: "Min Votes",
					description: "The minimum amount of votes to receive",
					schema: z.number(),
				},
			},
			name: "Amount",
		}),
	},
});
