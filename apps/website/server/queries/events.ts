import { env } from "~/env";
import { unstable_cache as cache } from "next/cache";
import { bets, events, quests, xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { asc, desc, eq, gt, or } from "drizzle-orm";

export const getEvents = cache(
	async (input?: { limit?: number }) => {
		////
		return db.query.events.findMany({
			orderBy: [desc(events.featured), desc(events.start)],
			limit: input?.limit,
		});
	},
	["getEvents"],
	{ revalidate: 60 * 10 },
);

export const getFeaturedEvent = cache(
	async () => {
		return db.query.events.findFirst({
			where: or(eq(events.featured, true), gt(events.end, new Date())),
			orderBy: desc(events.end),
		});
	},
	["getFeaturedEvent"],
	{ revalidate: 60 * 10 },
);

export const getEvent = cache(
	async (input: { id: string; user?: string }) => {
		////////////////////////
		return db.query.events.findFirst({
			where: eq(events.id, input.id),
			with: {
				quests: {
					orderBy: [desc(quests.featured), asc(quests.xp)],
					with: {
						community: true,
						completed: input.user
							? {
									limit: 1,
									where: eq(xp.user, input.user),
								}
							: undefined,
					},
				},
				rounds: {
					with: { community: true },
				},
				attendees: {
					with: { user: true },
				},
				predictions: {
					with: {
						outcomes: true,
						bets: input.user ? { where: eq(bets.user, input.user) } : undefined,
					},
				},
				community: true,
				products: true,
			},
		});
	},
	["getEvent"],
	{ revalidate: 60 * 10 },
);
