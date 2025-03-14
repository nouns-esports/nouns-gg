import { and, asc, desc, eq, sql } from "drizzle-orm";
import { awards, proposals, votes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import type { AuthenticatedUser } from "../queries/users";
import { roundState } from "@/utils/roundState";

export default async function placeFirst(user: AuthenticatedUser) {
	const proposalsCreated = await db.pgpool.query.proposals.findMany({
		where: and(eq(proposals.user, user.id)),
		with: {
			round: {
				with: {
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
	});

	for (const proposal of proposalsCreated) {
		const state = roundState(proposal.round);

		if (state !== "Ended") continue;
		if (proposal.round.proposals.length < 1) continue;

		const winningProposal = proposal.round.proposals.toSorted((a, b) => {
			const votesDiff = b.totalVotes - a.totalVotes;

			if (votesDiff === 0) {
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			}

			return votesDiff;
		})[0];

		if (winningProposal?.id === proposal.id) {
			return true;
		}
	}

	return false;
}
