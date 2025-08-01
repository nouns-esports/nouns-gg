import { events } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, desc, eq, gt, isNull, or, sql } from "drizzle-orm";

export async function getEvents(input?: {
	limit?: number;
	community?: string;
}) {
	return db.pgpool.query.events.findMany({
		where: and(
			input?.community ? eq(events.community, input.community) : undefined,
			eq(events.active, true),
			isNull(events.deletedAt),
		),
		orderBy: [desc(events.featured), desc(events.start)],
		limit: input?.limit,
		with: {
			community: true,
		},
	});
}

export async function getFeaturedEvent() {
	return db.pgpool.query.events.findFirst({
		where: or(eq(events.featured, true), gt(events.end, new Date())),
		orderBy: desc(events.end),
	});
}

export async function getEvent(
	input: { user?: string } & (
		| { id: string }
		| { handle: string; community?: string }
	),
) {
	return db.pgpool.query.events.findFirst({
		where:
			"id" in input
				? eq(events.id, input.id)
				: and(
						eq(events.handle, input.handle),
						input.community
							? eq(
									events.community,
									sql`(SELECT id FROM communities WHERE communities.handle = ${input.community})`,
								)
							: undefined,
					),
		with: {
			attendees: {
				with: {
					user: true,
				},
			},
			community: true,
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
}
