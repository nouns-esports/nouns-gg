import { embed } from "ai";
import { db } from "..";
import { eq, isNull } from "drizzle-orm";
import { quests } from "../schema/public";
import { openai } from "@ai-sdk/openai";

const allQuests = await db.primary.query.quests.findMany({
	where: isNull(quests.embedding),
	with: {
		actions: true,
		event: true,
		community: true,
	},
});

let count = 0;
for (const quest of allQuests) {
	count++;
	const text = [
		`Quest Name: ${quest.name}`,
		`Quest Handle: ${quest.handle}`,
		quest.description ? `Quest Description: ${quest.description}` : null,
		quest.event?.name ? `Quest Event Name: ${quest.event.name}` : null,
		quest.event?.handle ? `Quest Event Handle: ${quest.event.handle}` : null,
		quest.community?.name
			? `Quest Community Name: ${quest.community.name}`
			: null,
		quest.community?.handle
			? `Quest Community Handle: ${quest.community.handle}`
			: null,
		`Quest XP Reward: ${quest.xp}`,
		`Quest Points Reward: ${quest.points}`,
		`Quest Created At: ${quest.createdAt}`,
		`Quest Actions Required To Complete:
${quest.actions
	.map(
		(action, index) =>
			`${index + 1}. Action Type: ${action.action}, Action Description: ${action.description.map((d) => d.text).join(" ")}`,
	)
	.join("\n")}`,
	]
		.filter(Boolean)
		.join("\n");

	console.log("Embedding Quest", count, allQuests.length);

	const embedding = await embed({
		model: openai.embedding("text-embedding-3-small"),
		value: text,
	});

	await db.primary
		.update(quests)
		.set({
			embedding: embedding.embedding,
		})
		.where(eq(quests.id, quest.id));
}
