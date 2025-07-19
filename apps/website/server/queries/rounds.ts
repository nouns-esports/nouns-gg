import {
	awards,
	proposals,
	purchasedVotes,
	rounds,
	votes,
} from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { eq, asc, desc, sql, and, isNull } from "drizzle-orm";

export async function getRoundWithProposal(input: {
	round: string;
	user: string;
	community: string;
}) {
	return db.pgpool.query.rounds.findFirst({
		where: and(
			eq(rounds.handle, input.round),
			eq(
				rounds.community,
				sql`(SELECT id FROM communities WHERE communities.handle = ${input.community})`,
			),
		),
		with: {
			proposals: {
				where: eq(proposals.user, input.user),
			},
		},
	});
}

export async function getRound(
	input:
		| { id: string; user: string | undefined }
		| { handle: string; community?: string; user: string | undefined },
) {
	return db.pgpool.query.rounds.findFirst({
		where:
			"id" in input
				? eq(rounds.id, input.id)
				: and(
						eq(rounds.handle, input.handle),
						input.community
							? eq(
									rounds.community,
									sql`(SELECT id FROM communities WHERE communities.handle = ${input.community})`,
								)
							: undefined,
					),
		with: {
			awards: {
				orderBy: asc(awards.place),
				with: {
					asset: true,
				},
			},
			community: {
				with: {
					admins: true,
					plugins: true,
				},
			},
			proposals: {
				where: and(isNull(proposals.hiddenAt), isNull(proposals.deletedAt)),
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
						columns: {
							title: true,
						},
						with: {
							user: {
								columns: {
									id: true,
									name: true,
									image: true,
								},
							},
						},
					},
				},
				limit: 100,
				orderBy: desc(votes.timestamp),
			},
			purchasedVotes: input.user
				? {
						where: eq(purchasedVotes.user, input.user),
					}
				: undefined,
			event: {
				with: {
					community: true,
				},
			},
			actions: true,
		},
		// extras: {
		// 	uniqueVoters: sql<number>`(
		// 		SELECT COUNT(DISTINCT v.user)
		// 		FROM ${votes} v
		// 		JOIN ${rounds} r ON r.id = v.round
		// 		WHERE ${
		// 			"id" in input
		// 				? sql`r.id = ${input.id}`
		// 				: sql`r.handle = ${input.handle}`
		// 		}
		// 	  )`.as("uniqueVoters"),
		// 	uniqueProposers: sql<number>`(
		// 		SELECT COUNT(DISTINCT v.user)
		// 		FROM ${proposals} v
		// 		JOIN ${rounds} r ON r.id = v.round
		// 		WHERE ${
		// 			"id" in input
		// 				? sql`r.id = ${input.id}`
		// 				: sql`r.handle = ${input.handle}`
		// 		}
		// 	  )`.as("uniqueProposers"),
		// },
	});
}

export async function getRounds(input?: {
	limit?: number;
	event?: string;
	community?: string;
}) {
	return db.pgpool.query.rounds.findMany({
		limit: input?.limit,
		orderBy: [desc(rounds.featured), desc(rounds.end)],
		where: and(
			input?.event ? eq(rounds.event, input.event) : undefined,
			input?.community ? eq(rounds.community, input.community) : undefined,
			eq(rounds.active, true),
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
}
