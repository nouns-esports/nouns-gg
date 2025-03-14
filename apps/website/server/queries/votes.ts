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
	});
}

export async function getUserVotesForRound(input: {
	round: string;
	user: string;
	wallet?: string;
}) {
	const round = await db.pgpool.query.rounds.findFirst({
		where: eq(rounds.id, input.round),
		with: {
			votes: {
				where: or(
					eq(votes.user, input.user),
					input.wallet ? eq(votes.user, input.wallet) : undefined,
				),
				orderBy: desc(votes.count),
				with: {
					proposal: {
						columns: {
							title: true,
						},
					},
				},
				columns: {
					count: true,
				},
			},
		},
		columns: {
			id: true,
			start: true,
			end: true,
			votingStart: true,
			image: true,
		},
	});

	if (!round) {
		return;
	}

	if (round.votes.length < 1) {
		return;
	}

	const condensedVotes = round.votes.reduce(
		(acc: Record<string, typeof vote>, vote) => {
			if (!acc[vote.proposal.title]) {
				acc[vote.proposal.title] = { ...vote };
			} else acc[vote.proposal.title].count += vote.count;

			return acc;
		},
		{},
	);

	return {
		...round,
		votes: Object.values(condensedVotes),
	};
}
