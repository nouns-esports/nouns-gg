import {
	expandedPrediction,
	predictions,
} from "@/server/data/archive";

export async function getPrediction(
	input: { user?: string } & (
		| { handle: string; community?: string }
		| { id: string }
	),
) {
	const prediction = predictions.find((candidate) =>
		"id" in input
			? candidate.id === input.id
			: candidate.handle === input.handle &&
				(!input.community ||
					candidate.community.id === input.community ||
					candidate.community.handle === input.community),
	);
	return prediction ? expandedPrediction(prediction) : undefined;
}

export async function getPredictions(input: {
	user?: string;
	event?: string;
	community?: string;
	limit?: number;
}) {
	const result = predictions
		.filter(
			(prediction) =>
				!prediction.deletedAt &&
				(!input.event || prediction.eventId === input.event) &&
				(!input.community ||
					prediction.community.id === input.community ||
					prediction.community.handle === input.community),
		)
		.map(expandedPrediction);
	return input.limit ? result.slice(0, input.limit) : result;
}
