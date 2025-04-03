export function getPredictionOdds(props: {
	prediction: {
		pool: string;
		totalBets: number;
		outcomes: Array<{
			id: number;
			name: string;
			pool: string;
			totalBets: number;
		}>;
	};
}) {
	const outcomes = props.prediction.outcomes.toSorted((a, b) => {
		const aName = a.name.toLowerCase();
		const bName = b.name.toLowerCase();
		if (aName === "yes") return -1;
		if (bName === "yes") return 1;
		if (aName === "no") return -1;
		if (bName === "no") return 1;
		return aName.localeCompare(bName);
	});

	if (Number(props.prediction.pool) === 0) {
		if (outcomes.every((outcome) => outcome.totalBets === 0)) {
			return outcomes.map((outcome) => ({
				id: outcome.id,
				chance: Math.round(100 / props.prediction.outcomes.length),
			}));
		}

		return outcomes.map((outcome) => ({
			id: outcome.id,
			chance: Math.round(
				(outcome.totalBets / props.prediction.totalBets) * 100,
			),
		}));
	}

	if (outcomes.every((outcome) => Number(outcome.pool) === 0)) {
		return outcomes.map((outcome) => ({
			id: outcome.id,
			chance: Math.round(100 / props.prediction.outcomes.length),
		}));
	}

	return outcomes.map((outcome) => ({
		id: outcome.id,
		chance: Math.round(
			(Number(outcome.pool) / Number(props.prediction.pool)) * 100,
		),
	}));
}
