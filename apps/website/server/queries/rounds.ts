import { awards, proposals, rounds, votes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, asc, desc, sql, and } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export async function getRoundWithProposal(input: {
	round: string;
	user: string;
}) {
	return db.pgpool.query.rounds.findFirst({
		where: eq(rounds.handle, input.round),
		with: {
			proposals: {
				where: eq(proposals.user, input.user),
			},
		},
	});
}

export const getRound = cache(
	async (input: { id: string } | { handle: string; community?: string }) => {
		return db.pgpool.query.rounds.findFirst({
			where:
				"id" in input
					? eq(rounds.id, input.id)
					: and(
							eq(rounds.handle, input.handle),
							input.community
								? eq(rounds.community, input.community)
								: undefined,
						),
			with: {
				awards: {
					orderBy: asc(awards.place),
					with: {
						asset: true,
					},
				},
				community: true,
				proposals: {
					where: eq(proposals.hidden, false),
					with: {
						user: true,
					},
					extras: {
						totalVotes: sql<number>`(
							SELECT COALESCE(SUM(v.count), 0) AS total_votes
							FROM ${votes} v 
							WHERE v.proposal = ${proposals.id}
						)`.as("totalVotes"),
					},
				},
				votes: {
					with: {
						user: true,
						proposal: {
							with: {
								user: true,
							},
						},
					},
					limit: 100,
					orderBy: desc(votes.timestamp),
				},
				event: {
					with: {
						community: true,
					},
				},
				actions: true,
			},
			extras: {
				uniqueVoters: sql<number>`(
					SELECT COUNT(DISTINCT v.user)
					FROM ${votes} v
					JOIN ${rounds} r ON r.id = v.round
					${
						"id" in input
							? `WHERE r.id = ${input.id}`
							: `WHERE r.handle = ${input.handle}${input.community ? ` AND r.community = ${input.community}` : ""}`
					}
				  )`.as("uniqueVoters"),
				uniqueProposers: sql<number>`(
					SELECT COUNT(DISTINCT v.user)
					FROM ${proposals} v
					JOIN ${rounds} r ON r.id = v.round
					${
						"id" in input
							? `WHERE r.id = ${input.id}`
							: `WHERE r.handle = ${input.handle}${input.community ? ` AND r.community = ${input.community}` : ""}`
					}
				  )`.as("uniqueProposers"),
			},
		});
	},

	["rounds"],
	{ tags: ["rounds"], revalidate: 60 * 10 },
);

export const getRounds = cache(
	async (input?: {
		limit?: number;
		event?: string;
		community?: string;
	}) => {
		return db.pgpool.query.rounds.findMany({
			limit: input?.limit,
			orderBy: [desc(rounds.featured), desc(rounds.end)],
			where: and(
				input?.event ? eq(rounds.event, input.event) : undefined,
				input?.community ? eq(rounds.community, input.community) : undefined,
				eq(rounds.draft, false),
			),
			with: {
				community: true,
				event: {
					with: {
						community: true,
					},
				},
			},
		});
	},
	["rounds"],
	{ tags: ["rounds"], revalidate: 60 * 10 },
);
