import { getVotesForRound, proposals } from "@/server/data/archive";

export async function getPriorVotes(input: {
	round: string;
	user: string;
	wallet?: string;
}) {
	return getVotesForRound(input.round)
		.filter((vote) => vote.userId === input.user)
		.reduce((total, vote) => total + Number(vote.count), 0);
}

export async function getVotes(input: { round: string; user: string }) {
	return getVotesForRound(input.round)
		.filter((vote) => vote.userId === input.user)
		.map((vote) => ({
			...vote,
			proposal: proposals.find(
				(proposal) => proposal.id === vote.proposalId,
			),
		}));
}
