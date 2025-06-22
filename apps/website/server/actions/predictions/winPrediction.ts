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

export const winPrediction = createAction({
	image: "",
	name: "Win Prediction",
	category: "predictions",
	generateDescription: async (inputs) => {
		"use server";

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
			});

			if (!community) throw new Error("Community not found");

			return [
				{ text: "Win a prediction in" },
				{ text: community.name, href: `/c/${community.handle}` },
			];
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
			});

			if (!event) throw new Error("Event not found");

			return [
				{ text: "Win a prediction in" },
				{ text: event.name, href: `/events/${event.handle}` },
			];
		}

		return [{ text: "Win a prediction" }];
	},
	validateInputs: async ({ inputs, ctx }) => {
		"use server";

		if (inputs.community && inputs.event) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify both community and event",
			});
		}
	},
	check: async ({ user, inputs }) => {
		"use server";

		const userBets = await db.primary.query.bets.findMany({
			where: eq(bets.user, user.id),
			with: {
				outcome: true,
				prediction: true,
			},
		});

		if (inputs.community) {
			return userBets.some(
				(bet) =>
					bet.outcome.result === true &&
					bet.prediction.community === inputs.community?.id,
			);
		}

		if (inputs.event) {
			return userBets.some(
				(bet) =>
					bet.outcome.result === true &&
					bet.prediction.event === inputs.event?.id,
			);
		}

		return userBets.some((bet) => bet.outcome.result === true);
	},

	filters: {
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
					schema: z.string(),
				},
			},
			name: "Event",
		}),
	},
});
