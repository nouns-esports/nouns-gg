import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const dataRoot = resolve(import.meta.dir, "../data/public/v1");
const output = resolve(
	import.meta.dir,
	"../apps/website/server/data/archive-assets.generated.ts",
);
const fontOutput = resolve(
	import.meta.dir,
	"../apps/website/app/api/images/image-fonts.generated.ts",
);

const baseAssets = [
	["manifestJson", "manifest.json"],
	["communitiesJson", "communities/index.json"],
	["articlesJson", "articles/index.json"],
	["eventsJson", "events/index.json"],
	["roundsJson", "rounds/index.json"],
	["predictionsJson", "predictions/index.json"],
	["questsJson", "quests/index.json"],
	["rafflesJson", "raffles/index.json"],
	["productsJson", "products/index.json"],
	["collectionsJson", "collections/index.json"],
	["profilesJson", "profiles/index.json"],
	["proposalsJson", "activity/proposals.json"],
	["awardsJson", "activity/awards.json"],
	["outcomesJson", "activity/outcomes.json"],
	["traitsJson", "nouns/traits.json"],
	["latestNounJson", "nouns/latest.json"],
] as const;

const votes = jsonFiles(resolve(dataRoot, "activity/votes"));
const leaderboards = jsonFiles(resolve(dataRoot, "leaderboards"));

const lines = [
	"/* This file is generated from the approved public dataset. */",
	...baseAssets.map(
		([name, path]) => `import ${name} from "~/data/public/v1/${path}";`,
	),
	...votes.map(
		(file, index) =>
			`import voteFile${index} from "~/data/public/v1/activity/votes/${file}";`,
	),
	...leaderboards.map(
		(file, index) =>
			`import leaderboardFile${index} from "~/data/public/v1/leaderboards/${file}";`,
	),
	"",
	`export { ${baseAssets.map(([name]) => name).join(", ")} };`,
	"",
	"export const voteFiles: Record<string, unknown[]> = {",
	...votes.map(
		(file, index) => `\t${JSON.stringify(file.slice(0, -5))}: voteFile${index},`,
	),
	"};",
	"",
	"export const leaderboardFiles: Record<string, unknown[]> = {",
	...leaderboards.map(
		(file, index) =>
			`\t${JSON.stringify(file.slice(0, -5))}: leaderboardFile${index},`,
	),
	"};",
	"",
];

writeFileSync(output, lines.join("\n"));
const fontFiles = [
	"Cabin-Regular.ttf",
	"LuckiestGuy-Regular.ttf",
	"BebasNeue-Regular.ttf",
	"LondrinaSolid-Regular.ttf",
];
writeFileSync(
	fontOutput,
	[
		"/* This file is generated from public font assets. */",
		"export const imageFontData: Record<string, string> = {",
		...fontFiles.map(
			(file) =>
				`\t${JSON.stringify(file)}: ${JSON.stringify(
					readFileSync(
						resolve(import.meta.dir, `../apps/website/public/fonts/${file}`),
					).toString("base64"),
				)},`,
		),
		"};",
		"",
	].join("\n"),
);
console.log(
	`Generated public data module with ${votes.length} vote files, ${leaderboards.length} leaderboards, and ${fontFiles.length} image fonts.`,
);

function jsonFiles(directory: string) {
	return readdirSync(directory)
		.filter((file) => file.endsWith(".json"))
		.sort();
}
