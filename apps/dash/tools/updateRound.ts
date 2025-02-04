import { agent } from "../";
import { db, rounds } from "~/packages/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

agent.addTool({
	description:
		"Takes a nouns.gg round id and updates any specified parameters on it",
	providers: ["discord"],
	parameters: z.object({
		round: z
			.string()
			.describe(
				"The round id to update (the path segment displayed after /rounds/ in the url)",
			),
		update: z.object({
			name: z.string().optional().describe("The new name/title of the round"),
			start: z
				.date()
				.optional()
				.describe("The date and time the round starts in UTC"),
			votingStart: z
				.date()
				.optional()
				.describe("The date and time the round voting starts in UTC"),
			end: z
				.date()
				.optional()
				.describe("The date and time the round ends in UTC"),
			community: z
				.string()
				.optional()
				.describe("The community the round belongs to"),
			event: z.string().optional().describe("The event the round belongs to"),
			featured: z
				.boolean()
				.optional()
				.describe(
					"Change whether the round should be featured and pinned to the top of the feed",
				),
		}),
	}),
	execute: async ({ parameters, context }) => {
		console.log(parameters);
		console.log(context);

		if (
			![
				"samscolari",
				"sasquatch",
				"peterpandam",
				"ohantheman",
				"patyiutazza",
			].includes(context.author)
		) {
			throw new Error("You are not authorized to update rounds");
		}

		const round = await db.query.rounds.findFirst({
			where: eq(rounds.id, parameters.round),
		});

		if (!round) {
			throw new Error("I couldn't find that round");
		}

		await db.transaction(async (tx) => {
			if (parameters.update.name !== undefined) {
				await tx
					.update(rounds)
					.set({ name: parameters.update.name })
					.where(eq(rounds.id, round.id));
			}

			if (parameters.update.start !== undefined) {
				console.log("Date start: ", new Date(parameters.update.start));
				// await tx
				// 	.update(rounds)
				// 	.set({ start: new Date(parameters.update.start) })
				// 	.where(eq(rounds.id, round.id));
			}

			if (parameters.update.votingStart !== undefined) {
				console.log(
					"Date voting start: ",
					new Date(parameters.update.votingStart),
				);
				// await tx
				// 	.update(rounds)
				// 	.set({ votingStart: new Date(parameters.update.votingStart) })
				// 	.where(eq(rounds.id, round.id));
			}

			if (parameters.update.end !== undefined) {
				console.log("Date end: ", new Date(parameters.update.end));
				// await tx
				// 	.update(rounds)
				// 	.set({ end: new Date(parameters.update.end) })
				// 	.where(eq(rounds.id, round.id));
			}

			if (parameters.update.community !== undefined) {
				await tx
					.update(rounds)
					.set({ community: parameters.update.community })
					.where(eq(rounds.id, round.id));
			}

			if (parameters.update.event !== undefined) {
				await tx
					.update(rounds)
					.set({ event: parameters.update.event })
					.where(eq(rounds.id, round.id));
			}

			if (parameters.update.featured !== undefined) {
				await tx
					.update(rounds)
					.set({ featured: parameters.update.featured })
					.where(eq(rounds.id, round.id));
			}
		});
	},
});
