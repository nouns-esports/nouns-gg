import { awards, proposals, rounds, votes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, asc, desc, sql, and } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getRoundWithProposal = cache(
	async (input: { round: string; user: string }) => {
		return db.pgpool.query.rounds.findFirst({
			where: eq(rounds.handle, input.round),
			with: {
				proposals: {
					where: eq(proposals.user, input.user),
					limit: 1,
				},
			},
		});
	},
	["rounds"],
	{ tags: ["rounds"], revalidate: 60 * 10 },
);

export const getRound = cache(
	async (input: { handle: string }) => {
		return db.pgpool.query.rounds.findFirst({
			where: eq(rounds.handle, input.handle),
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
						user: {
							with: {
								rank: true,
							},
						},
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
						user: {
							with: {
								rank: true,
							},
						},
						proposal: {
							with: {
								user: {
									with: {
										rank: true,
									},
								},
							},
						},
					},
					limit: 100,
					orderBy: desc(votes.timestamp),
				},
				event: true,
				minProposerRank: true,
				minVoterRank: true,
				creator: true,
			},
			extras: {
				uniqueVoters: sql<number>`(
					SELECT COUNT(DISTINCT v.user)
					FROM ${votes} v
					JOIN ${rounds} r ON r.id = v.round
					WHERE r.handle = ${input.handle}
				  )`.as("uniqueVoters"),
				uniqueProposers: sql<number>`(
					SELECT COUNT(DISTINCT v.user)
					FROM ${proposals} v
					JOIN ${rounds} r ON r.id = v.round
					WHERE r.handle = ${input.handle}
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
		event?: number;
		community?: number;
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
				awards: {
					columns: {
						asset: true,
						value: true,
					},
				},
				proposals: {
					columns: {
						user: true,
					},
				},
				votes: {
					columns: {
						user: true,
					},
				},
				creator: true,
			},
		});
	},
	["rounds"],
	{ tags: ["rounds"], revalidate: 60 * 10 },
);
