import { agent } from "../";
import { leaderboards, nexus, xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

agent.addTool({
	description: "Tips xp to a mentioned user",
	providers: ["discord"],
	parameters: z.object({
		amount: z.number().describe("The amount of xp to tip"),
	}),
	execute: async ({ parameters, context }) => {
		if (
			![
				"samscolari",
				"sasquatch",
				"peterpandam",
				"ohantheman",
				"patyiutazza",
			].includes(context.author)
		) {
			console.log("Not authorized");
			throw new Error("You are not authorized to tip xp");
		}

		console.log("parameters", parameters);
		console.log("context", context);

		if (parameters.amount > 500) {
			throw new Error("You can't tip more than 500xp at a time");
		}

		if (context.mentions?.length === 0) {
			throw new Error("You must mention a user to tip xp to");
		}

		const [user, mentionedUser] = await Promise.all([
			db.primary.query.nexus.findFirst({
				where: eq(nexus.discord, context.author),
			}),
			context.mentions?.[0]
				? db.primary.query.nexus.findFirst({
						where: eq(nexus.discord, context.mentions[0]),
					})
				: undefined,
		]);

		console.log("user", user);
		console.log("mentionedUser", mentionedUser);

		if (!user) {
			throw new Error("Link your Discord account to your Nexus to tip xp");
		}

		if (!mentionedUser) {
			throw new Error(
				`${context.mentions?.[0] ?? "The user you have mentioned"} has not linked their Discord account to their Nexus`,
			);
		}

		if (user.id === mentionedUser.id) {
			throw new Error("You can't tip xp to yourself");
		}

		await db.primary.transaction(async (tx) => {
			await tx
				.update(nexus)
				.set({
					xp: sql`${nexus.xp} + ${parameters.amount}`,
				})
				.where(eq(nexus.id, mentionedUser.id));

			await tx.insert(xp).values({
				user: mentionedUser.id,
				amount: parameters.amount,
				timestamp: new Date(),
				community: 7,
			});

			await tx
				.insert(leaderboards)
				.values({
					user: user.id,
					xp: parameters.amount,
					community: 7,
				})
				.onConflictDoUpdate({
					target: [leaderboards.user, leaderboards.community],
					set: {
						xp: sql`${leaderboards.xp} + ${parameters.amount}`,
					},
				});
		});

		console.log("Should be a success");

		return `Successfully tipped ${parameters.amount}xp to ${mentionedUser.discord}`;
	},
});
