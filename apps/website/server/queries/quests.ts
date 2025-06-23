import { questCompletions, quests, xp } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, asc, desc, eq, gt, gte, isNull, lt, lte } from "drizzle-orm";
import {
	unstable_cache as cache,
	unstable_noStore as noStore,
} from "next/cache";

export const getQuests = cache(
	async (input: {
		limit?: number;
		user?: string;
		event?: string;
		community?: string;
	}) => {
		return db.pgpool.query.quests.findMany({
			limit: input.limit,
			where: and(
				eq(quests.active, true),
				input.event ? eq(quests.event, input.event) : undefined,
				input.community ? eq(quests.community, input.community) : undefined,
				eq(quests.draft, false),
			),
			orderBy: [desc(quests.featured), desc(quests.createdAt)],
			with: {
				community: true,
				completions: input.user
					? {
							where: eq(questCompletions.user, input.user),
							limit: 1,
						}
					: undefined,
				event: {
					with: {
						community: true,
					},
				},
			},
		});
	},
	["getQuests"],
	{ tags: ["getQuests"], revalidate: 60 * 10 },
);

export const getQuest = cache(
	async (
		input: { user?: string } & (
			| { id: string }
			| { handle: string; community?: string }
		),
	) => {
		return db.pgpool.query.quests.findFirst({
			where:
				"id" in input
					? eq(quests.id, input.id)
					: and(
							eq(quests.handle, input.handle),
							// input.community
							// 	? eq(quests.community, input.community)
							// 	: undefined,
						),
			with: {
				completions: input.user
					? {
							where: eq(questCompletions.user, input.user),
							limit: 1,
						}
					: undefined,
				event: {
					with: {
						community: true,
					},
				},
				actions: true,
				community: true,
			},
		});
	},
	["getQuest"],
	{ tags: ["getQuest"], revalidate: 60 * 10 },
);
