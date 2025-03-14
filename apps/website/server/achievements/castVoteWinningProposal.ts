import { proposals, votes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import type { AuthenticatedUser } from "../queries/users";
import { desc, eq, sql } from "drizzle-orm";
import { roundState } from "@/utils/roundState";

export default async function castVoteWinningProposal(user: AuthenticatedUser) {
	const votesCast = await db.pgpool.query.votes.findMany({
		where: eq(votes.user, user.id),
		with: {
			proposal: {
				with: {
					round: {
						with: {
							awards: true,
							proposals: {
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
			},
		},
	});

	for (const voteCast of votesCast) {
		const proposal = voteCast.proposal;
		const round = proposal.round;

		const state = roundState(proposal.round);

		if (state !== "Ended") continue;
		if (!proposal) continue;
		if (!round) continue;

		for (let i = 0; i < round.awards.length; i++) {
			const winningProposal = round.proposals.toSorted((a, b) => {
				const votesDiff = b.totalVotes - a.totalVotes;

				if (votesDiff === 0) {
					return (
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);
				}

				return votesDiff;
			})[i];

			if (winningProposal?.id === proposal.id) {
				return true;
			}
		}
	}

	return false;
}
