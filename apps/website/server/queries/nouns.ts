import {
	latestNoun,
	traits,
} from "@/server/data/archive";

export async function getTrait(input: {
	type: "accessory" | "body" | "head" | "glasses";
	index: number;
}) {
	return traits.find(
		(trait) => trait.type === input.type && trait.index === input.index,
	);
}

export async function getTraits(input: {
	accessory: number;
	body: number;
	head: number;
	glasses: number;
}) {
	return {
		accessory: await getTrait({
			type: "accessory",
			index: input.accessory,
		}),
		body: await getTrait({ type: "body", index: input.body }),
		head: await getTrait({ type: "head", index: input.head }),
		glasses: await getTrait({ type: "glasses", index: input.glasses }),
	};
}

export async function getTraitCounts() {
	return {
		accessory: traits.filter((trait) => trait.type === "accessory").length,
		body: traits.filter((trait) => trait.type === "body").length,
		head: traits.filter((trait) => trait.type === "head").length,
		glasses: traits.filter((trait) => trait.type === "glasses").length,
	};
}

export async function getNoun(input: { id?: number }): Promise<any> {
	if (input.id && Number(latestNoun?.id) !== input.id) return undefined;
	if (!latestNoun) return undefined;
	const nounTraits = await getTraits({
		accessory: Number(String(latestNoun.accessory).split(":").at(-1)),
		body: Number(String(latestNoun.body).split(":").at(-1)),
		head: Number(String(latestNoun.head).split(":").at(-1)),
		glasses: Number(String(latestNoun.glasses).split(":").at(-1)),
	});
	return { ...latestNoun, ...nounTraits };
}
