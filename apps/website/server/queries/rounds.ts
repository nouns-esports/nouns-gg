import { awards, proposals, rounds, votes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";

import {
	eq,
	gt,
	and,
	lt,
	asc,
	desc,
	exists,
	isNotNull,
	sql,
} from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";
import { neynarClient } from "../clients/neynar";
import { env } from "~/env";

export const getRoundWithProposal = cache(
	async (input: { round: string; user: string }) => {
		return db.query.rounds.findFirst({
			where: eq(rounds.id, input.round),
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
	async (input: { id: string }) => {
		return db.query.rounds.findFirst({
			where: eq(rounds.id, input.id),
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
			},
			extras: {
				uniqueVoters: sql<number>`(
					SELECT COUNT(DISTINCT v.user)
					FROM ${votes} v
					WHERE v.round = ${input.id})
				`.as("uniqueVoters"),
				uniqueProposers: sql<number>`(
					SELECT COUNT(DISTINCT v.user)
					FROM ${proposals} v
					WHERE v.round = ${input.id})
				`.as("uniqueProposers"),
			},
		});
	},

	["rounds"],
	{ tags: ["rounds"], revalidate: 60 * 10 },
);

export const getRounds = cache(
	async (input?: {
		limit?: number;
	}) => {
		return db.query.rounds.findMany({
			limit: input?.limit,
			orderBy: [desc(rounds.featured), desc(rounds.end)],
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
			},
		});
	},
	["rounds"],
	{ tags: ["rounds"], revalidate: 60 * 10 },
);

// export const getComments = cache(
// 	async (input: { round: string }) => {
// 		const [roundCasts, voteCasts] = await Promise.all([
// 			neynarClient.fetchFeed("filter", {
// 				filterType: "embed_url",
// 				embedUrl: `${env.NEXT_PUBLIC_DOMAIN}/rounds/${input.round}`,
// 			}),
// 			neynarClient.fetchFeed("filter", {
// 				filterType: "embed_url",
// 				embedUrl: `${env.NEXT_PUBLIC_DOMAIN}/api/frames/rounds/${input.round}`,
// 			}),
// 		]);

// 		return [...roundCasts.casts, ...voteCasts.casts].filter(
// 			(cast) => cast.text.length > 0,
// 		);
// 	},
// 	["comments"],
// 	{ tags: ["comments"], revalidate: 60 * 10 },
// );
