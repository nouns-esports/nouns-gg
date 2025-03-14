import { proposals, votes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import type { AuthenticatedUser } from "../queries/users";
import { and, eq, gt, sql } from "drizzle-orm";

export default async function getAVote(user: AuthenticatedUser) {
	const userProposals = await db.pgpool.query.proposals.findMany({
		where: eq(proposals.user, user.id),
		extras: {
			totalVotes: sql<number>`(
        SELECT SUM(v.count) AS total_votes
        FROM ${votes} v 
        WHERE v.proposal = ${proposals.id}
      )`.as("totalVotes"),
		},
		columns: {
			id: true,
		},
	});

	for (const proposal of userProposals) {
		if (proposal.totalVotes > 0) return true;
	}

	return false;
}
