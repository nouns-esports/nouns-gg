import {
	expandedRound,
	proposals,
	rounds,
} from "@/server/data/archive";

export async function getRoundWithProposal(input: {
	round: string;
	user: string;
	community: string;
}) {
	const round = await getRound({
		handle: input.round,
		community: input.community,
		user: input.user,
	});
	if (!round) return undefined;
	return {
		...round,
		proposals: proposals.filter(
			(proposal) =>
				proposal.roundId === round.id && proposal.userId === input.user,
		),
	};
}

export async function getRound(
	input:
		| { id: string; user: string | undefined }
		| { handle: string; community?: string; user: string | undefined },
) {
	const round = rounds.find((candidate) =>
		"id" in input
			? candidate.id === input.id
			: candidate.handle === input.handle &&
				(!input.community ||
					candidate.community.id === input.community ||
					candidate.community.handle === input.community),
	);
	return round ? expandedRound(round) : undefined;
}

export async function getRounds(input?: {
	limit?: number;
	event?: string;
	community?: string;
}) {
	const result = rounds
		.filter(
			(round) =>
				round.active &&
				(!input?.event || round.eventId === input.event) &&
				(!input?.community ||
					round.community.id === input.community ||
					round.community.handle === input.community),
		)
		.sort(
			(a, b) =>
				Number(b.featured) - Number(a.featured) || +b.end - +a.end,
		);
	return input?.limit ? result.slice(0, input.limit) : result;
}
