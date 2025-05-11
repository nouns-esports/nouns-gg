import { inArray } from "drizzle-orm";
import { db } from "..";
import { raffles } from "../schema/public";

const ids = [1];

const allRaffles = await db.primary.query.raffles.findMany({
	where: inArray(raffles.id, ids),
	with: {
		entries: {
			with: {
				user: true,
			},
		},
	},
});

for (const raffle of allRaffles) {
	if (raffle.entries.length === 0) {
		console.log(`Raffle ${raffle.handle} has no entries.`);
		continue;
	}

	const winner =
		raffle.entries[Math.floor(Math.random() * raffle.entries.length)];

	console.log(
		`Raffle ${raffle.handle} winner: ${
			winner.user.discord
				? `${winner.user.discord} (Discord)`
				: `${winner.user.id} (ID)`
		}`,
	);
}
