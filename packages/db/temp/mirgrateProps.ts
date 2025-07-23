// import { and, asc, eq, isNull, sql } from "drizzle-orm";
// import { db } from ".";
// import { awards, proposals, rounds, votes } from "./schema/public";

// const oldRoundId = "c6fd484a-67e7-4ccb-97ac-4cbeb2a07405";
// const newRoundId = "efaecac8-883f-4a57-91c4-4ca47d917895";

// const round = await db.primary.query.rounds.findFirst({
// 	where: eq(rounds.id, oldRoundId),
// 	with: {
// 		awards: {
// 			orderBy: asc(awards.place),
// 			with: {
// 				asset: true,
// 			},
// 		},
// 		proposals: {
// 			where: and(isNull(proposals.hiddenAt), isNull(proposals.deletedAt)),
// 			with: {
// 				votes: true,
// 			},
// 			extras: {
// 				totalVotes: sql<number>`(
//                         SELECT COALESCE(SUM(v.count), 0) AS total_votes
//                         FROM ${votes} v
//                         WHERE v.proposal = ${proposals.id}
//                     )`.as("totalVotes"),
// 			},
// 		},
// 	},
// });

// if (!round) {
// 	throw new Error("Round not found");
// }

// const roundProposals = round.proposals.toSorted((a, b) => {
// 	const votesDiff = b.totalVotes - a.totalVotes;
// 	if (votesDiff !== 0) return votesDiff;

// 	return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
// });

// let count = 0;
// await db.primary.transaction(async (tx) => {
// 	for (const {
// 		totalVotes,
// 		votes: proposalVotes,
// 		...proposal
// 	} of roundProposals) {
// 		count++;

// 		if (count <= 8) {
// 			console.log(proposal.title, totalVotes);
// 			const [newProposal] = await tx
// 				.insert(proposals)
// 				.values({
// 					...proposal,
// 					id: undefined,
// 					round: newRoundId,
// 					createdAt: new Date("2025-07-23 16:21:00"),
// 				})
// 				.returning();

// 			let countVotes = 0;
// 			for (const vote of proposalVotes) {
// 				countVotes++;
// 				console.log(proposal.title, countVotes, proposalVotes.length);
// 				await tx.insert(votes).values({
// 					...vote,
// 					id: undefined,
// 					proposal: newProposal.id,
// 					timestamp: new Date("2025-07-23 16:22:00"),
// 					round: newRoundId,
// 				});
// 			}
// 		}
// 	}
// });
