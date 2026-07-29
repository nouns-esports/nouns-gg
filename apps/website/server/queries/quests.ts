import { expandedQuest, quests } from "@/server/data/archive";

export async function getQuests(input: {
	limit?: number;
	user?: string;
	event?: string;
	community?: string;
}) {
	const result = quests
		.filter(
			(quest) =>
				quest.active &&
				(!input.event || quest.eventId === input.event) &&
				(!input.community ||
					quest.community.id === input.community ||
					quest.community.handle === input.community),
		)
		.sort(
			(a, b) =>
				Number(b.featured) - Number(a.featured) ||
				+b.createdAt - +a.createdAt,
		)
		.map(expandedQuest);
	return input.limit ? result.slice(0, input.limit) : result;
}

export async function getQuest(
	input: { user?: string } & (
		| { id: string }
		| { handle: string; community?: string }
	),
) {
	const quest = quests.find((candidate) =>
		"id" in input
			? candidate.id === input.id
			: candidate.handle === input.handle &&
				(!input.community ||
					candidate.community.id === input.community ||
					candidate.community.handle === input.community),
	);
	return quest ? expandedQuest(quest) : undefined;
}
