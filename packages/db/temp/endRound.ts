import { asc, desc, eq, gt, lt, sql } from "drizzle-orm";
import { db } from "..";
import { awards, proposals, rounds, votes } from "../schema/public";

const allRounds = await db.pgpool.query.rounds.findMany({
	where: lt(rounds.end, new Date()),
	orderBy: desc(rounds.end),
	with: {
		awards: {
			orderBy: asc(awards.place),
		},
		proposals: {
			where: eq(proposals.hidden, false),
			extras: {
				totalVotes: sql<number>`(
                    SELECT COALESCE(SUM(v.count), 0) AS total_votes
                    FROM ${votes} v 
                    WHERE v.proposal = ${proposals.id}
                )`.as("totalVotes"),
			},
		},
	},
});

console.log("Rounds", allRounds.length);

await db.pgpool.transaction(async (tx) => {
	for (const round of allRounds) {
		const roundProposals = round.proposals.toSorted((a, b) => {
			const votesDiff = b.totalVotes - a.totalVotes;

			if (votesDiff === 0) {
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			}

			return votesDiff;
		});

		console.log(`--- ${round.handle} --------------------------`);

		for (let i = 0; i < roundProposals.length; i++) {
			const proposal = roundProposals[i];
			const winner = i < round.awards.length;

			if (winner) {
				console.log(i + 1, proposal.title);
				await tx
					.update(proposals)
					.set({ winner: i + 1 })
					.where(eq(proposals.id, proposal.id));
			}
		}
	}
});
