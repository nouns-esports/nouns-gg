import { db } from ".";
import { and, eq, gt, sql } from "drizzle-orm";
import { gold, leaderboards, nexus, xp } from "./schema/public";

const eligibleForGold = 100;
const potOfGold = 50_000;

const xpEarnedThisWeek = await db.pgpool.query.xp.findMany({
	where: gt(xp.timestamp, new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)),
	with: {
		user: true,
	},
});

const xpByUser: Record<
	string,
	{ amount: number; user: Awaited<typeof xpEarnedThisWeek>[number]["user"] }
> = {};

for (const xp of xpEarnedThisWeek) {
	if (!xp.user) continue;

	xpByUser[xp.user.id] = {
		amount: (xpByUser[xp.user.id]?.amount ?? 0) + xp.amount,
		user: xp.user,
	};
}

const sortedXpByUser = Object.entries(xpByUser).sort(
	(a, b) => b[1].amount - a[1].amount,
);

// await db.primary.transaction(async (tx) => {
for (
	let i = 0;
	i <
	(sortedXpByUser.length >= eligibleForGold
		? eligibleForGold
		: sortedXpByUser.length);
	i++
) {
	const [_, { amount, user }] = sortedXpByUser[i];

	const earning = generateEarning({
		pot: potOfGold,
		participants: eligibleForGold,
		index: i,
	});

	console.log(i + 1, user.name ?? user.id, earning);

	const nounsgg = "98e09ea8-4c19-423c-9733-b946b6f70902";

	// await tx.insert(gold).values({
	// 	community: nounsgg,
	// 	to: user.id,
	// 	amount: earning,
	// });

	// await tx
	// 	.update(leaderboards)
	// 	.set({
	// 		points: sql`${leaderboards.points} + ${earning}`,
	// 	})
	// 	.where(
	// 		and(
	// 			eq(leaderboards.user, user.id),
	// 			eq(leaderboards.community, nounsgg),
	// 		),
	// 	);
}
// });

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
