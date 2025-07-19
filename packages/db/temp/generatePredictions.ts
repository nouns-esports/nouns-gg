import { db } from "../";
import { predictions, outcomes } from "../schema/public";

const image =
	"https://ipfs.nouns.gg/ipfs/bafkreiadlbtcrhrr5bgnao7tgmms55kqj5o2ygiqvonr7ah2n4zmohm4re";
const rules = {
	type: "doc",
	content: [],
};
const event = "88988b0e-8055-4fff-89e8-4cc6dc7f88a9";
const community = "f7c2a496-fc72-4ab1-bb69-5e997e352efb";

const generatedData: Array<{
	handle: string; // prediction handle (for a url)
	name: string; // prediction name
	xp: 150 | 250 | 500;
	prizePool: 25 | 50 | 100;
	outcomes: Array<{
		name: string;
	}>;
}> = [
	{
		handle: "series-length",
		name: "How many games will the series last?",
		xp: 250,
		prizePool: 100,
		outcomes: [{ name: "3 games" }, { name: "4 games" }, { name: "5 games" }],
	},
	{
		handle: "game-under-25-minutes",
		name: "Will a game last less than 25 minutes?",
		xp: 250,
		prizePool: 100,
		outcomes: [{ name: "Yes" }, { name: "No" }],
	},
	{
		handle: "match-over-55-minutes",
		name: "Will a match last more than 55 minutes?",
		xp: 250,
		prizePool: 100,
		outcomes: [{ name: "Yes" }, { name: "No" }],
	},
	{
		handle: "rampage-in-match",
		name: "Will any match have a Rampage (5 kills by one player)?",
		xp: 250,
		prizePool: 100,
		outcomes: [{ name: "Yes" }, { name: "No" }],
	},
];

await db.primary.transaction(async (tx) => {
	for (const data of generatedData) {
		const [prediction] = await tx
			.insert(predictions)
			.values({
				rules,
				image,
				handle: data.handle,
				name: data.name,
				_xp: {
					winning: data.xp,
					predicting: 100,
				},
				prizePool: data.prizePool,
				event,
				community,
				pool: 0,
			})
			.returning({
				id: predictions.id,
			});

		for (const outcome of data.outcomes) {
			await tx.insert(outcomes).values({
				prediction: prediction.id,
				name: outcome.name,
				pool: 0,
			});
		}
	}
});
