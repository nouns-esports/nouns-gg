// import { and, asc, eq, isNull, sql } from "drizzle-orm";
// import { db } from ".";
// import { awards, proposals, rounds, votes } from "./schema/public";

// const round = await db.primary.query.rounds.findFirst({
// 	where: eq(rounds.id, "b9b80bdd-69d6-4172-bc34-85ede97fb038"),
// 	with: {
// 		awards: {
// 			orderBy: asc(awards.place),
// 			with: {
// 				asset: true,
// 			},
// 		},
// 		proposals: {
// 			where: and(
// 				eq(proposals.hidden, false),
// 				isNull(proposals.hiddenAt),
// 				isNull(proposals.deletedAt),
// 			),
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
// 	// if (state === "Ended") {
// 	//     if (a.winner != null && b.winner != null) {
// 	//         return a.winner - b.winner;
// 	//     }

// 	//     if (a.winner != null) return -1;
// 	//     if (b.winner != null) return 1;
// 	// }

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

// 		if (count <= 24) {
// 			console.log(proposal.title, totalVotes);
// 			const [newProposal] = await tx
// 				.insert(proposals)
// 				.values({
// 					...proposal,
// 					id: undefined,
// 					round: "c6fd484a-67e7-4ccb-97ac-4cbeb2a07405",
// 					createdAt: new Date("2025-07-15 15:45:00"),
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
// 					timestamp: new Date("2025-07-15 15:45:00"),
// 					round: "c6fd484a-67e7-4ccb-97ac-4cbeb2a07405",
// 				});
// 			}
// 		}
// 	}
// });
