// function generateEarnings(input: {
// 	pot: number;
// 	participants: number;
// }): number[] {
// 	const decay = 5 / input.participants;
// 	const earnings = Array.from({ length: input.participants }, (_, i) => {
// 		return Math.exp(-decay * i);
// 	});

// 	const total = earnings.reduce((sum, val) => sum + val, 0);
// 	return earnings.map((val) => val * (input.pot / total));
// }

// const earnings = generateEarnings({
// 	pot: 500_000,
// 	participants: 1000,
// });

// for (let i = 0; i < earnings.length; i++) {
// 	// if (i % 10 === 0) {
// 	console.log(i + 1, earnings[i]);
// 	// }
// }

// console.log(earnings.reduce((sum: number, val: number) => sum + val, 0));

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

let total = 0;
const participants = 100;

for (let i = 0; i < participants - 1; i++) {
	const earning = generateEarning({
		pot: 50_000,
		participants,
		index: i,
	});
	console.log(i + 1, earning);
	total += earning;
}

console.log("Total:", total);
