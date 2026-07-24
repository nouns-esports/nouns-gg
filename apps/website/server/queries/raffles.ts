import { raffles } from "@/server/data/archive";

export async function getRaffles(input?: {
	event?: string;
	user?: string;
	community?: string;
}) {
	return raffles.filter(
		(raffle) =>
			raffle.active &&
			(!input?.event || raffle.eventId === input.event) &&
			(!input?.community ||
				raffle.community.id === input.community ||
				raffle.community.handle === input.community),
	);
}

export async function getRaffle(
	input: { user?: string } & (
		| { id: string }
		| { handle: string; community?: string }
	),
) {
	return raffles.find((candidate) =>
		"id" in input
			? candidate.id === input.id
			: candidate.handle === input.handle &&
				(!input.community ||
					candidate.community.id === input.community ||
					candidate.community.handle === input.community),
	);
}
