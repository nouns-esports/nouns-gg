import {
	events,
	expandedEvent,
} from "@/server/data/archive";

export async function getEvents(input?: {
	limit?: number;
	community?: string;
}) {
	const result = events
		.filter(
			(event) =>
				event.active &&
				(!input?.community ||
					event.community.id === input.community ||
					event.community.handle === input.community),
		)
		.sort(
			(a, b) =>
				Number(b.featured) - Number(a.featured) ||
				+b.start - +a.start,
		);
	return input?.limit ? result.slice(0, input.limit) : result;
}

export async function getFeaturedEvent() {
	return events
		.filter((event) => event.featured || +event.end > Date.now())
		.sort((a, b) => +b.end - +a.end)[0];
}

export async function getEvent(
	input: { user?: string } & (
		| { id: string }
		| { handle: string; community?: string }
	),
) {
	const event = events.find((candidate) =>
		"id" in input
			? candidate.id === input.id
			: candidate.handle === input.handle &&
				(!input.community ||
					candidate.community.id === input.community ||
					candidate.community.handle === input.community),
	);
	return event ? expandedEvent(event) : undefined;
}
