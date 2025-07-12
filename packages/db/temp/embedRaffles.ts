import { embed } from "ai";
import { openai } from "~/packages/agent/models";
import { db } from "..";
import { eq, isNull } from "drizzle-orm";
import { raffles } from "../schema/public";
import { tiptapToText } from "~/packages/utils/tiptapToText";

const allRaffles = await db.primary.query.raffles.findMany({
	where: isNull(raffles.embedding),
	with: {
		community: true,
		event: true,
	},
});

let count = 0;
for (const raffle of allRaffles) {
	count++;
	const text = [
		`Raffle Name: ${raffle.name}`,
		`Raffle Handle: ${raffle.handle}`,
		`Raffle Description: ${tiptapToText(raffle.description)}`,
		raffle.community?.name
			? `Raffle Community Name: ${raffle.community.name}`
			: null,
		raffle.community?.handle
			? `Raffle Community Handle: ${raffle.community.handle}`
			: null,
		raffle.event?.name ? `Raffle Event Name: ${raffle.event.name}` : null,
		raffle.event?.handle ? `Raffle Event Handle: ${raffle.event.handle}` : null,
		`Raffle Start Date: ${raffle.start}`,
		`Raffle End Date: ${raffle.end}`,
		`Raffle Points Cost: ${raffle.gold}`,
		`Raffle Winner Count: ${raffle.winners}`,
		raffle.limit ? `Raffle Entry Limit Count: ${raffle.limit}` : null,
	]
		.filter(Boolean)
		.join("\n");

	console.log("Embedding Raffle", count, allRaffles.length);

	const embedding = await embed({
		model: openai.embedding("text-embedding-3-small"),
		value: text,
	});

	await db.primary
		.update(raffles)
		.set({
			embedding: embedding.embedding,
		})
		.where(eq(raffles.id, raffle.id));
}
