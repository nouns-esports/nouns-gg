import { env } from "~/env";
import { unstable_cache as cache } from "next/cache";
import {
	bets,
	events,
	quests,
	raffleEntries,
	raffles,
	xp,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { asc, desc, eq, gt, or, sql } from "drizzle-orm";

export const getEvents = cache(
	async (input?: { limit?: number }) => {
		return db.pgpool.query.events.findMany({
			orderBy: [desc(events.featured), desc(events.start)],
			limit: input?.limit,
		});
	},
	["getEvents"],
	{ revalidate: 60 * 10 },
);

export const getFeaturedEvent = cache(
	async () => {
		return db.pgpool.query.events.findFirst({
			where: or(eq(events.featured, true), gt(events.end, new Date())),
			orderBy: desc(events.end),
		});
	},
	["getFeaturedEvent"],
	{ revalidate: 60 * 10 },
);

export const getEvent = cache(
	async (input: { handle: string; user?: string }) => {
		return db.pgpool.query.events.findFirst({
			where: eq(events.handle, input.handle),
			with: {
				attendees: {
					with: {
						user: {
							columns: {
								id: true,
								image: true,
								name: true,
								username: true,
							},
						},
					},
				},
				community: true,
				creator: true,
			},
			extras: {
				hasRounds: sql<boolean>`
					(
						SELECT COUNT(*) FROM rounds WHERE rounds.event = ${events.id}
					) > 0
				`.as("hasRounds"),
				hasQuests: sql<boolean>`
					(
						SELECT COUNT(*) FROM quests WHERE quests.event = ${events.id}
					) > 0
				`.as("hasQuests"),
				hasPredictions: sql<boolean>`
					(	
						SELECT COUNT(*) FROM predictions WHERE predictions.event = ${events.id}
					) > 0
				`.as("hasPredictions"),
				hasShop: sql<boolean>`
					(
						SELECT COUNT(*) > 0 FROM (
							SELECT 1 FROM products WHERE products.event = ${events.id}
							UNION ALL
							SELECT 1 FROM raffles WHERE raffles.event = ${events.id}
						)
					)
				`.as("hasShop"),
			},
		});
	},
	["getEvent"],
	{ revalidate: 60 * 10 },
);
