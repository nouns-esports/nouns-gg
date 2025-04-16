const eligibleForGold = 100;
const potOfGold = 50_000;

function generateEarning(input: {
	pot: number;
	participants: number;
	index: number;
}): number {
	const decay = 5 / input.participants;

	// Calculate value at this index
	const value = Math.exp(-decay * input.index);

	// Calculate sum of all values to get total
	let total = 0;
	for (let i = 0; i < input.participants - 1; i++) {
		total += Math.exp(-decay * i);
	}

	return Number((value * (input.pot / total)).toFixed(2));
}
