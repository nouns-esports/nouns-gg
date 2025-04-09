import { db } from "../";
import { predictions, outcomes } from "../schema/public";

const handlePrefix = "";
const image = "";
const rules = {
	type: "doc",
	content: [],
};
const event = 9;
const community = null;
const creator = "";

const generatedData: Array<{
	handle: string; // unique prediction handle (for a url)
	name: string; // prediction name
	xp: 100 | 200 | 300;
	outcomes: Array<{
		name: string;
		pool: "1";
	}>;
}> = [];

await db.primary.transaction(async (tx) => {
	for (const data of generatedData) {
		const [prediction] = await tx
			.insert(predictions)
			.values({
				rules,
				image,
				handle: `${handlePrefix}-${data.handle}`,
				name: data.name,
				xp: data.xp,
				event,
				community,
				pool: data.outcomes.length.toString(),
				creator,
			})
			.returning({
				id: predictions.id,
			});

		for (const outcome of data.outcomes) {
			await tx.insert(outcomes).values({
				prediction: prediction.id,
				name: outcome.name,
				pool: outcome.pool,
			});
		}
	}
});
