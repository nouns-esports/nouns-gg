import { agent } from "../";
import { gold, leaderboards, nexus, rounds } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, eq, sql } from "drizzle-orm";
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

		const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902"

		const [user, mentionedUser] = await Promise.all([
			db.primary.query.nexus.findFirst({
				where: eq(nexus.discord, context.author),
				with: {
					leaderboards: {
						where: eq(leaderboards.community, nounsgg),
					},
				},
			}),
			context.mentions?.[0]
				? db.primary.query.nexus.findFirst({
					where: eq(nexus.discord, context.mentions[0]),
				})
				: undefined,
		]);

		if (!user) {
			throw new Error("Link your Discord account to your Nexus to tip gold");
		}

		if (!mentionedUser) {
			throw new Error(
				`${context.mentions?.[0] ?? "The user you have mentioned"} has not linked their Discord account to their Nexus`,
			);
		}

		if (user.id === mentionedUser.id) {
			throw new Error("You can't tip gold to yourself");
		}

		const userBalance = user.leaderboards.find(leaderboard => leaderboard.community === nounsgg)?.points ?? 0;

		if (userBalance < parameters.amount) {
			throw new Error("You don't have enough gold to tip");
		}

		await db.primary.transaction(async (tx) => {
			await tx.insert(leaderboards).values({
				user: user.id,
				community: nounsgg,
			}).onConflictDoUpdate({
				target: [leaderboards.user, leaderboards.community],
				set: {
					points: sql`${leaderboards.points} - ${parameters.amount}`,
				},
			});

			await tx.insert(leaderboards).values({
				user: mentionedUser.id,
				community: nounsgg,
				points: parameters.amount,
			}).onConflictDoUpdate({
				target: [leaderboards.user, leaderboards.community],
				set: {
					points: sql`${leaderboards.points} + ${parameters.amount}`,
				},
			});

			await tx.insert(gold).values({
				community: nounsgg,
				from: user.id,
				to: mentionedUser.id,
				amount: parameters.amount,
			});
		});

		return `Successfully tipped ${parameters.amount} gold to ${mentionedUser.discord}`;
	},
});
