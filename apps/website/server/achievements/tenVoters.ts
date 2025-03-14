import { eq } from "drizzle-orm";
import { proposals } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import type { AuthenticatedUser } from "../queries/users";

export default async function tenVoters(user: AuthenticatedUser) {
	const proposalsCreated = await db.pgpool.query.proposals.findMany({
		where: eq(proposals.user, user.id),
		with: {
			votes: true,
		},
	});

	for (const proposal of proposalsCreated) {
		const unqiueVoters = new Set(proposal.votes.map((vote) => vote.user));

		if (unqiueVoters.size >= 10) {
			return true;
		}
	}

	return false;
}
