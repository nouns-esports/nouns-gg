import { rounds, votes } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, desc, eq, or } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

export async function getPriorVotes(input: {
	round: string;
	user: string;
	wallet?: string;
}) {
	noStore();

	const previousVotes = await db.pgpool.query.votes.findMany({
		where: and(
			or(
				eq(votes.user, input.user),
				input.wallet ? eq(votes.user, input.wallet) : undefined,
			),
			eq(votes.round, input.round),
		),
		columns: { count: true },
	});

	return previousVotes.reduce((votes, vote) => votes + vote.count, 0);
}

export async function getVotes(input: { round: string; user: string }) {
	return db.pgpool.query.votes.findMany({
		where: and(eq(votes.user, input.user), eq(votes.round, input.round)),
		with: {
			proposal: true,
		},
	});
}
