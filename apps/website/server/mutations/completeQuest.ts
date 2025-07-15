"use server";

import { z } from "zod";
import { onlyUser } from ".";
import {
	leaderboards,
	nexus,
	questCompletions,
	quests,
	xp,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, sql } from "drizzle-orm";
import { getAction } from "../actions";
import { revalidatePath } from "next/cache";
import { posthogClient } from "../clients/posthog";

export const completeQuest = onlyUser
	.schema(
		z.object({
			quest: z.string(),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const now = new Date();

		const quest = await db.primary.query.quests.findFirst({
			where: eq(quests.id, parsedInput.quest),
			with: {
				completions: {
					where: eq(questCompletions.user, ctx.user.id),
					limit: 1,
				},
				actions: true,
				community: {
					with: {
						admins: true,
						connections: true,
					},
				},
			},
		});

		if (!quest) {
			throw new Error("Quest not found");
		}

		if (quest.completions?.length > 0) {
			throw new Error("Quest already completed");
		}

		if (!quest.active) {
			throw new Error("Quest is not active");
		}

		if (quest.start && new Date(quest.start) > now) {
			throw new Error("Quest hasn't started yet");
		}

		if (quest.end && new Date(quest.end) < now) {
			throw new Error("Quest has closed");
		}

		const actions = await Promise.all(
			quest.actions.map(async (actionState) => {
				const action = getAction({
					action: actionState.action,
					platform: actionState.platform ?? "dash",
				});

				if (!action) {
					throw new Error("Action not found");
				}

				return {
					...actionState,
					completed: await action.check({
						user: ctx.user.nexus,
						input: actionState.input,
						community: quest.community,
					}),
				};
			}),
		);

		if (!actions.every((action) => action.completed)) {
			throw new Error("Not all actions completed");
		}

		let newXP = 0;

		await db.primary.transaction(async (tx) => {
			await tx.insert(xp).values({
				quest: quest.id,
				user: ctx.user.id,
				amount: quest.xp,
				timestamp: now,
				community: quest.community,
			});

			const [updatePass] = await tx
				.insert(leaderboards)
				.values({
					user: ctx.user.id,
					xp: quest.xp,
					community: quest.community,
				})
				.onConflictDoUpdate({
					target: [leaderboards.user, leaderboards.community],
					set: {
						xp: sql`${leaderboards.xp} + ${quest.xp}`,
					},
				})
				.returning({
					xp: leaderboards.xp,
				});

			newXP = updatePass.xp;

			await tx.insert(questCompletions).values({
				quest: quest.id,
				user: ctx.user.id,
				timestamp: now,
			});
		});

		posthogClient.capture({
			event: "quest-completed",
			distinctId: ctx.user.id,
			properties: {
				quest: quest.id,
				community: quest.community,
			},
		});

		revalidatePath(`/quests/${quest.handle}`);
		revalidatePath("/quests");

		if (ctx.user.farcaster?.username) {
			revalidatePath(`/users/${ctx.user.farcaster.username}`);
		} else revalidatePath(`/users/${ctx.user.id}`);

		return { newXP };
	});
