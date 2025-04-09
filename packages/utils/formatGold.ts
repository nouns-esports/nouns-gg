export function formatGold(gold: number) {
	if (gold >= 1000) {
		return `${(Math.floor(gold) / 1000).toFixed(1)}k`;
	}

	if (gold % 1 === 0) {
		return Math.floor(gold);
	}

	return gold;
}
