import { roundState } from "@/utils/roundState";
import type { AuthenticatedUser } from "../queries/users";
import { and, eq, desc, sql } from "drizzle-orm";
import { db, proposals, votes } from "~/packages/db/schema";

export default async function winARound(user: AuthenticatedUser) {
	const proposalsCreated = await db.query.proposals.findMany({
		where: and(eq(proposals.user, user.id)),
		with: {
			round: {
				with: {
					awards: true,
					proposals: {
						with: {
							user: {
								with: {
									rank: true,
								},
							},
						},
						extras: {
							totalVotes: sql<number>`(
                SELECT SUM(v.count) AS total_votes
                FROM ${votes} v 
                WHERE v.proposal = ${proposals.id}
              )`.as("totalVotes"),
						},
					},
				},
			},
		},
	});

	for (const proposal of proposalsCreated) {
		const state = roundState(proposal.round);

		if (state !== "Ended") continue;

		const winningProposals = proposal.round.proposals.toSorted((a, b) => {
			const votesDiff = b.totalVotes - a.totalVotes;

			if (votesDiff === 0) {
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			}

			return votesDiff;
		});

		for (let i = 0; i < proposal.round.awards.length; i++) {
			if (winningProposals[i]?.id === proposal.id) {
				return true;
			}
		}
	}

	return false;
}
