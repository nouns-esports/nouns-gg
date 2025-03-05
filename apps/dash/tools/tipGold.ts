import { agent } from "../";
import { gold, nexus, rounds } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

agent.addTool({
	description: "Tips gold from the authors balance to another user",
	providers: ["discord"],
	parameters: z.object({
		amount: z.number().describe("The amount of gold to tip"),
	}),
	execute: async ({ parameters, context }) => {
		console.log(parameters);
		console.log(context);

		if (context.mentions?.length === 0) {
			throw new Error("You must mention a user to tip gold to");
		}

		const [user, mentionedUser] = await Promise.all([
			db.query.nexus.findFirst({
				where: eq(nexus.discord, context.author),
			}),
			context.mentions?.[0]
				? db.query.nexus.findFirst({
						where: eq(nexus.discord, context.mentions[0]),
					})
				: undefined,
		]);

		if (!user) {
			throw new Error("Link your Discord account to your Nexus to tip gold");
		}

		if (!mentionedUser) {
			throw new Error(
				"The user you mentioned has not linked their Discord account to their Nexus",
			);
		}

		if (user.id === mentionedUser.id) {
			throw new Error("You can't tip gold to yourself");
		}

		if (Number(user.gold) < parameters.amount) {
			throw new Error("You don't have enough gold to tip");
		}

		await db.transaction(async (tx) => {
			await tx
				.update(nexus)
				.set({
					gold: sql`${nexus.gold} - ${parameters.amount}`,
				})
				.where(eq(nexus.id, user.id));

			await tx
				.update(nexus)
				.set({
					gold: sql`${nexus.gold} + ${parameters.amount}`,
				})
				.where(eq(nexus.id, mentionedUser.id));

			await tx.insert(gold).values({
				from: user.id,
				to: mentionedUser.id,
				amount: parameters.amount.toString(),
				timestamp: new Date(),
			});
		});

		return `Successfully tipped ${parameters.amount} gold to ${mentionedUser.discord}`;
	},
});
