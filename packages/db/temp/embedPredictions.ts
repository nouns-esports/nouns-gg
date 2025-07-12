import { embed } from "ai";
import { openai } from "~/packages/agent/models";
import { db } from "..";
import { eq, isNull } from "drizzle-orm";
import { predictions } from "../schema/public";
import { tiptapToText } from "~/packages/utils/tiptapToText";

const allPredictions = await db.primary.query.predictions.findMany({
	where: isNull(predictions.embedding),
	with: {
		community: true,
		event: true,
		outcomes: true,
	},
});

let count = 0;
for (const prediction of allPredictions) {
	count++;
	const text = [
		`Prediction Name: ${prediction.name}`,
		`Prediction Handle: ${prediction.handle}`,
		// prediction.rules
		// 	? `Prediction Rules: ${tiptapToText(prediction.rules)}`
		// 	: null,
		prediction.event?.name
			? `Prediction Event Name: ${prediction.event.name}`
			: null,
		prediction.event?.handle
			? `Prediction Event Handle: ${prediction.event.handle}`
			: null,
		prediction.community?.name
			? `Prediction Community Name: ${prediction.community.name}`
			: null,
		prediction.community?.handle
			? `Prediction Community Handle: ${prediction.community.handle}`
			: null,
		`Prediction XP Reward: ${prediction.xp}`,
		`Prediction Outcomes: ${prediction.outcomes.map((o) => o.name).join(", ")}`,
	]
		.filter(Boolean)
		.join("\n");

	console.log(text);
	console.log("--------------------------------");

	// console.log("Embedding Prediction", count, allPredictions.length);

	// const embedding = await embed({
	// 	model: openai.embedding("text-embedding-3-small"),
	// 	value: text,
	// });

	// await db.primary
	// 	.update(predictions)
	// 	.set({
	// 		embedding: embedding.embedding,
	// 	})
	// 	.where(eq(predictions.id, prediction.id));
}
