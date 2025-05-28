"use server";

import { onlyUser } from ".";
import { z } from "zod";
import { db } from "~/packages/db";
import {
	communities,
	gold,
	leaderboards,
	nexus,
	raffleEntries,
	xp,
} from "~/packages/db/schema/public";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { posthogClient } from "../clients/posthog";

export const enterRaffle = onlyUser
	.schema(
		z.object({
			raffle: z.number(),
			amount: z.number(),
		}),
	)
	.action(async ({ parsedInput, ctx }) => {
		const raffle = await db.primary.query.raffles.findFirst({
			where: (t, { eq }) => eq(t.id, parsedInput.raffle),
			with: {
				event: true,
				entries: {
					where: (t, { eq }) => eq(t.user, ctx.user.id),
				},
			},
		});

		if (!raffle) {
			throw new Error("Raffle not found");
		}

		const now = new Date();

		if (now < new Date(raffle.start)) {
			throw new Error("Raffle has not started yet");
		}

		if (now > new Date(raffle.end)) {
			throw new Error("Raffle has ended");
		}

		if (raffle.limit) {
			const userEntries = raffle.entries.reduce(
				(acc, curr) => acc + curr.amount,
				0,
			);

			if (userEntries + parsedInput.amount > raffle.limit) {
				throw new Error(
					"You have reached the maximum number of entries for this raffle",
				);
			}
		}

		let newXP = 0;

		const earnedXP = 10 * parsedInput.amount;

		await db.primary.transaction(async (tx) => {
			const cost = raffle.gold * parsedInput.amount;

			const [updateNexus] = await tx
				.update(nexus)
				.set({
					gold: sql`${nexus.gold} - ${cost}`,
					xp: sql`${nexus.xp} + ${earnedXP}`,
				})
				.where(eq(nexus.id, ctx.user.id))
				.returning({
					xp: nexus.xp,
				});

			newXP = updateNexus.xp;

			const [raffleEntry] = await tx
				.insert(raffleEntries)
				.values({
					raffle: parsedInput.raffle,
					user: ctx.user.id,
					amount: parsedInput.amount,
					timestamp: now,
				})
				.returning({
					id: raffleEntries.id,
				});

			await tx.insert(xp).values({
				user: ctx.user.id,
				amount: earnedXP,
				timestamp: now,
				raffleEntry: raffleEntry.id,
				community: raffle.community,
			});

			await tx
				.insert(leaderboards)
				.values({
					user: ctx.user.id,
					xp: earnedXP,
					community: raffle.community,
				})
				.onConflictDoUpdate({
					target: [leaderboards.user, leaderboards.community],
					set: {
						xp: sql`${leaderboards.xp} + ${earnedXP}`,
					},
				});

			await tx.insert(gold).values({
				from: ctx.user.id,
				toCommunity: raffle.community,
				amount: cost.toString(),
				timestamp: now,
				raffleEntry: raffleEntry.id,
			});

			await tx
				.update(communities)
				.set({
					gold: sql`${communities.gold} + ${cost}`,
				})
				.where(eq(communities.id, raffle.community));
		});

		posthogClient.capture({
			event: "raffle-entry",
			distinctId: ctx.user.id,
			properties: {
				raffle: raffle.id,
				community: raffle.community,
				amount: parsedInput.amount,
			},
		});

		revalidatePath("/shop");

		if (raffle.event) {
			revalidatePath(`/events/${raffle.event.handle}`);
		}

		if (ctx.user.farcaster?.username) {
			revalidatePath(`/users/${ctx.user.farcaster.username}`);
		} else revalidatePath(`/users/${ctx.user.id}`);

		return { earnedXP, newXP };
	});
