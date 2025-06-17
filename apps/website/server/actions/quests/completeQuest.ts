import { z } from "zod";
import { createAction } from "../createAction";
import {
	communities,
	events,
	questCompletions,
	quests,
	xp,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { createFilter } from "../createFilter";
import { and, eq, isNotNull } from "drizzle-orm";

export const completeQuest = createAction({
	image: "",
	name: "Complete Quest",
	category: "quests",
	generateDescription: async (inputs) => {
		"use server";

		if (inputs.quest) {
			const quest = await db.primary.query.quests.findFirst({
				where: eq(quests.id, inputs.quest.id),
			});

			if (!quest) throw new Error("Quest not found");

			return [
				{ text: "Complete" },
				{ text: quest.name, href: `/quests/${quest.handle}` },
			];
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
			});

			if (!community) throw new Error("Community not found");

			return [
				{ text: "Complete a quest in" },
				{ text: community.name, href: `/c/${community.handle}` },
			];
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
			});

			if (!event) throw new Error("Event not found");

			return [
				{ text: "Complete a quest in" },
				{ text: event.name, href: `/events/${event.handle}` },
			];
		}

		return [{ text: "Complete a quest" }];
	},
	check: async ({ user, inputs }) => {
		"use server";

		if (inputs.quest) {
			const quest = await db.primary.query.quests.findFirst({
				where: eq(quests.id, inputs.quest.id),
				with: {
					completions: {
						where: eq(questCompletions.user, user.id),
						limit: 1,
					},
				},
			});

			if (!quest) return false;

			return quest.completions.length > 0;
		}

		if (inputs.event) {
			const event = await db.primary.query.events.findFirst({
				where: eq(events.id, inputs.event.id),
				with: {
					quests: {
						with: {
							completions: {
								where: eq(questCompletions.user, user.id),
								limit: 1,
							},
						},
					},
				},
			});

			if (!event) return false;

			return event.quests.some((quest) => quest.completions.length > 0);
		}

		if (inputs.community) {
			const community = await db.primary.query.communities.findFirst({
				where: eq(communities.id, inputs.community.id),
				with: {
					quests: {
						with: {
							completions: {
								where: eq(questCompletions.user, user.id),
								limit: 1,
							},
						},
					},
				},
			});

			if (!community) return false;

			return community.quests.some((quest) => quest.completions.length > 0);
		}

		const completed = await db.primary.query.questCompletions.findFirst({
			where: and(
				eq(questCompletions.user, user.id),
				isNotNull(questCompletions.quest),
			),
		});

		return !!completed;
	},
	validateInputs: async ({ inputs, ctx }) => {
		"use server";

		if (inputs.quest && inputs.event && inputs.community) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Cannot specify all three: quest, event, and community",
			});
		}

		if (inputs.quest && inputs.event) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Quest and event cannot both be provided",
			});
		}

		if (inputs.quest && inputs.community) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Quest and community cannot both be provided",
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
		quest: createFilter({
			options: {
				id: { name: "ID", description: "The quest ID", schema: z.number() },
			},
			name: "Quest",
		}),
		community: createFilter({
			options: {
				id: { name: "ID", description: "The community ID", schema: z.string() },
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
