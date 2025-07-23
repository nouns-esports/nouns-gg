import { db } from "~/packages/db";
import { attendees, events, nexus, xp } from "~/packages/db/schema/public";
import { privyClient } from "../clients/privy";
import { createJob } from "../createJob";
import { eq, sql } from "drizzle-orm";
import { env } from "~/env";

type Tournament = {
	tournament: {
		numAttendees: number;
		participants: {
			nodes: Array<{
				email: string | null;
			}>;
		};
	} | null;
};

const targetEvents = {
	"nouns-bowl": "nouns-bowl-2025",
	nounsvitational: "nounsvitational-2024",
	"tipped-off-16": "tipped-off-16-safari",
	"the-works": "the-works-2025",
	"quebecup-2025": "quebecup",
	"fast-falls": "fast-fall-2025",
};

export const startGGSync = createJob({
	name: "Start GG Sync",
	cron: "0 * * * *", // Every hour
	execute: async () => {
		for (const [handle, slug] of Object.entries(targetEvents)) {
			const response = await fetch("https://api.start.gg/gql/alpha", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${env.START_GG_ACCESS_TOKEN}`,
				},
				body: JSON.stringify({
					query: `
						query Tournament($slug: String!) {
							tournament(slug: $slug) {
								numAttendees
								participants(query: {page: 0, perPage: 500}) {
									nodes {
										email
									}
								}
							}
						}
					`,
					variables: {
						slug,
					},
				}),
			});

			const { data } = (await response.json()) as { data: Tournament };

			if (!data.tournament) continue;

			await db.primary.transaction(async (tx) => {
				if (!data.tournament) return;

				const event = await tx.query.events.findFirst({
					where: eq(events.handle, handle),
					with: {
						attendees: true,
					},
				});

				if (!event) return;

				await tx
					.update(events)
					.set({
						attendeeCount: data.tournament.numAttendees,
					})
					.where(eq(events.handle, handle));

				for (const participant of data.tournament.participants.nodes) {
					if (!participant.email) continue;

					await new Promise((resolve) => setTimeout(resolve, 1000));
					const privyUser = await privyClient.getUserByEmail(participant.email);

					if (!privyUser) continue;

					const user = await tx.query.nexus.findFirst({
						where: eq(nexus.privyId, privyUser.id),
					});

					if (!user) continue;

					if (event.attendees.some((attendee) => attendee.user === user.id)) {
						continue;
					}

					await tx.insert(attendees).values({
						user: user.id,
						event: event.id,
					});
				}
			});
		}
	},
});
