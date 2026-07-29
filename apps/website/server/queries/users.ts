import {
	profiles,
	proposals,
	publicProfile,
	rounds,
	getVotesForRound,
} from "@/server/data/archive";

export type AuthenticatedUser = any;

export async function getAuthenticatedUser(): Promise<any | undefined> {
	return undefined;
}

export async function getUser(input: { id: string } | { privy: string }) {
	if ("privy" in input) return undefined;
	return publicProfile(input.id);
}

export async function getUserStats(input: { user: string }) {
	const voteCount = rounds.reduce(
		(total, round) =>
			total +
			getVotesForRound(round.id).filter((vote) => vote.userId === input.user)
				.length,
		0,
	);
	return {
		proposalsCreated: proposals.filter(
			(proposal) => proposal.userId === input.user,
		).length,
		questsCompleted: 0,
		votesCast: voteCount,
	};
}

export { profiles };
