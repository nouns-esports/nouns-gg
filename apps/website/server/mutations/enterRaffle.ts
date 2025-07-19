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
			raffle: z.string(),
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
		let earnedXP = 0;

		await db.primary.transaction(async (tx) => {
			const cost = raffle.gold * parsedInput.amount;

			const [raffleEntry] = await tx
				.insert(raffleEntries)
				.values({
					raffle: parsedInput.raffle,
					user: ctx.user.id,
					amount: parsedInput.amount,
				})
				.returning({
					id: raffleEntries.id,
				});

			const amount = raffle.xp ? raffle.xp.entering * parsedInput.amount : 0;

			if (amount > 0) {
				await tx.insert(xp).values({
					user: ctx.user.id,
					amount,
					raffle: raffle.id,
					raffleEntry: raffleEntry.id,
					community: raffle.community,
					for: "ENTERING_RAFFLE",
				});
			}

			const [updatePass] = await tx
				.insert(leaderboards)
				.values({
					user: ctx.user.id,
					xp: amount,
					community: raffle.community,
				})
				.onConflictDoUpdate({
					target: [leaderboards.user, leaderboards.community],
					set: {
						xp: sql`${leaderboards.xp} + ${amount}`,
						points: sql`${leaderboards.points} - ${cost}`,
					},
				})
				.returning({
					xp: leaderboards.xp,
				});

			newXP = updatePass.xp;
			earnedXP = amount;

			await tx.insert(gold).values({
				from: ctx.user.id,
				to: null,
				amount: cost,
				raffle: raffle.id,
				raffleEntry: raffleEntry.id,
				community: raffle.community,
				for: "ENTERING_RAFFLE",
			});
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

		return { earnedXP, totalXP: newXP };
	});
