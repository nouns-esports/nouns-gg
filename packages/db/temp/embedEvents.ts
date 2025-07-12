import { embed } from "ai";
import { openai } from "~/packages/agent/models";
import { db } from "..";
import { eq, isNull } from "drizzle-orm";
import { events } from "../schema/public";

const allEvents = await db.primary.query.events.findMany({
	where: isNull(events.embedding),
	with: {
		community: true,
	},
});

let count = 0;
for (const event of allEvents) {
	count++;
	const text = [
		`Event Name: ${event.name}`,
		`Event Handle: ${event.handle}`,
		event.description ? `Event Description: ${event.description}` : null,
		event.community?.name
			? `Event Community Name: ${event.community.name}`
			: null,
		event.community?.handle
			? `Event Community Handle: ${event.community.handle}`
			: null,
		`Event Start Date: ${event.start}`,
		`Event End Date: ${event.end}`,
		event.location ? `Event Location: ${event.location.name}` : null,
	]
		.filter(Boolean)
		.join("\n");

	console.log("Embedding Event", count, allEvents.length);

	const embedding = await embed({
		model: openai.embedding("text-embedding-3-small"),
		value: text,
	});

	await db.primary
		.update(events)
		.set({
			embedding: embedding.embedding,
		})
		.where(eq(events.id, event.id));
}
