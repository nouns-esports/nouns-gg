import { z } from "zod";
import { createAction } from "../createAction";
import { createFilter } from "../createFilter";
import { db } from "~/packages/db";
import {
	bets,
	communities,
	events,
	predictions,
} from "~/packages/db/schema/public";
import { and, eq } from "drizzle-orm";

export const makePrediction = createAction({
	image: "",
	name: "Make Prediction",
	category: "predictions",
	generateDescription: async (inputs) => {
		"use server";

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
			});

			if (!community) throw new Error("Community not found");

			return [
				{ text: "Make a prediction in" },
				{ text: community.name, href: `/c/${community.handle}` },
			];
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
			});

			if (!event) throw new Error("Event not found");

			return [
				{ text: "Make a prediction in" },
				{ text: event.name, href: `/events/${event.handle}` },
			];
		}

		if (inputs.prediction) {
			const prediction = await db.primary.query.predictions.findFirst({
				where: eq(predictions.id, inputs.prediction.id),
			});

			if (!prediction) throw new Error("Prediction not found");

			return [
				{ text: "Make a prediction on" },
				{ text: prediction.name, href: `/predictions/${prediction.handle}` },
			];
		}

		return [{ text: "Make a prediction" }];
	},
	check: async ({ user, inputs }) => {
		"use server";

		if (inputs.prediction) {
			const bet = await db.primary.query.bets.findFirst({
				where: and(
					eq(bets.user, user.id),
					eq(bets.prediction, inputs.prediction.id),
				),
			});

			return !!bet;
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
				with: {
					predictions: {
						with: {
							bets: {
								where: eq(bets.user, user.id),
								limit: 1,
							},
						},
					},
				},
			});

			if (!event) return false;

			return event.predictions.some((prediction) => prediction.bets.length > 0);
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),

				with: {
					predictions: {
						with: {
							bets: {
								where: eq(bets.user, user.id),
								limit: 1,
							},
						},
					},
				},
			});

			if (!community) return false;

			return community.predictions.some(
				(prediction) => prediction.bets.length > 0,
			);
		}

		const bet = await db.primary.query.bets.findFirst({
			where: eq(bets.user, user.id),
		});

		return !!bet;
	},
	validateInputs: async ({ inputs, ctx }) => {
		"use server";

		if (inputs.prediction && inputs.community && inputs.event) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify all three: prediction, community, and event",
			});
		}

		if (inputs.prediction && inputs.community) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Prediction and community cannot both be provided",
			});
		}

		if (inputs.prediction && inputs.event) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Prediction and event cannot both be provided",
			});
		}

		if (inputs.event && inputs.community) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Event and community cannot both be provided",
			});
		}
	},
	filters: {
		prediction: createFilter({
			options: {
				id: {
					name: "ID",
					description: "The prediction ID",
					schema: z.number(),
				},
			},
			name: "Prediction",
		}),
		community: createFilter({
			options: {
				id: {
					name: "ID",
					description: "The community ID",
					schema: z.string(),
				},
			},
			name: "Community",
		}),
		event: createFilter({
			options: {
				id: {
					name: "ID",
					description: "The event ID",
					schema: z.number(),
				},
			},
			name: "Event",
		}),
	},
});
