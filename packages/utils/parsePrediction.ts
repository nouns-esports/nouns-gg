import { bets, gold, outcomes, predictions } from "~/packages/db/schema/public";

type Prediction = typeof predictions.$inferSelect & {
	outcomes: Array<
		typeof outcomes.$inferSelect & {
			totalBets: number;
		}
	>;
	gold?: Array<typeof gold.$inferSelect>;
	bets?: Array<
		typeof bets.$inferSelect & {
			outcome: typeof outcomes.$inferSelect;
		}
	>;
	totalBets: number;
};

export function parsePrediction(prediction: Prediction) {
	const state = prediction.resolved
		? "resolved"
		: prediction.closed
			? "closed"
			: "open";

	const binary = prediction.outcomes.length === 2;

	const outcomes = prediction.outcomes.toSorted((a, b) => {
		const aName = a.name.toLowerCase();
		const bName = b.name.toLowerCase();

		if (aName === "yes") return -1;
		if (bName === "yes") return 1;
		if (aName === "no") return -1;
		if (bName === "no") return 1;

		if (a.pool === 0 && b.pool === 0) {
			return b.totalBets - a.totalBets;
		}

		const poolDiff = Number(b.pool) - Number(a.pool);
		if (poolDiff !== 0) return poolDiff;

		const aNumber = parseInt(aName);
		const bNumber = parseInt(bName);

		if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber)) {
			return aNumber - bNumber;
		}

		return aName.localeCompare(bName);
	});

	return {
		...prediction,
		outcomes: outcomes.map((outcome) => {
			const hasPool = outcomes.some((o) => o.pool > 0);

			let odds = 0;

			// console.log(
			// 	"ODDS",
			// 	prediction.name,
			// 	outcome.name,
			// 	prediction.totalBets, //0
			// 	prediction.outcomes.length, //3
			// 	outcome.totalBets, //0
			// 	hasPool, //false
			// 	outcome.pool, //0
			// 	prediction.pool, //0
			// );

			console.log("OUTCOME", outcome.name, prediction.name);

			if (hasPool) {
				console.log("has pool scenario");
				odds = (outcome.pool / prediction.pool) * 100;
			} else {
				console.log("no pool scenario");
				if (prediction.totalBets === 0) {
					console.log("no prediction bets scenario");
					odds = 100 / prediction.outcomes.length;
				} else if (outcome.totalBets === 0) {
					console.log("no outcome bets scenario", typeof prediction.totalBets);
					odds = (1 / prediction.totalBets) * 100;
				} else {
					console.log("normal scenario");
					odds = (outcome.totalBets / prediction.totalBets) * 100;
				}
			}

			// console.log("FINAL ODDS", prediction.name, outcome.name, odds);

			return {
				...outcome,
				odds,
			};
		}),
		binary,
		state,
		userBet:
			prediction.bets && prediction.bets.length > 0
				? prediction.bets[0]
				: undefined,
	};
}
