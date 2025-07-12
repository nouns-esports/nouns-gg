import { embed } from "ai";
import { openai } from "~/packages/agent/models";
import { db } from "..";
import { eq, isNull } from "drizzle-orm";
import { rounds } from "../schema/public";
import {
	lexicalToText,
	type LexicalNode,
} from "~/packages/utils/lexicalToText";

const allRounds = await db.primary.query.rounds.findMany({
	where: isNull(rounds.embedding),
	with: {
		community: true,
		event: true,
		actions: true,
	},
});

let count = 0;
for (const round of allRounds) {
	count++;
	const text = [
		`Round Name: ${round.name}`,
		`Round Handle: ${round.handle}`,
		`Round Description: ${lexicalToText(JSON.parse(round.content) as LexicalNode)}`,
		round.event?.name ? `Round Event Name: ${round.event.name}` : null,
		round.event?.handle ? `Round Event Handle: ${round.event.handle}` : null,
		round.community?.name
			? `Round Community Name: ${round.community.name}`
			: null,
		round.community?.handle
			? `Round Community Handle: ${round.community.handle}`
			: null,
		`Round Type: ${round.type}`,
		`Round Proposing Start Date: ${round.start}`,
		`Round Voting Start Date: ${round.votingStart}`,
		`Round Voting End Date: ${round.end}`,
		`Round Proposing Actions To Participate: 
${round.actions
	.filter((a) => a.type === "proposing" && a.required)
	.map(
		(action, index) =>
			`${index + 1}. Action Type: ${action.action}, Action Description: ${action.description.map((d) => d.text).join(" ")}`,
	)
	.join("\n")}`,

		`Round Voting Actions To Participate: 
${round.actions
	.filter((a) => a.type === "voting" && a.required)
	.map(
		(action, index) =>
			`${index + 1}. Action Type: ${action.action}, Action Description: ${action.description.map((d) => d.text).join(" ")}`,
	)
	.join("\n")}`,
		`Round Voting Actions For Extra Votes: 
${round.actions
	.filter((a) => a.type === "voting" && !a.required)
	.map(
		(action, index) =>
			`${index + 1}. Action Type: ${action.action}, Action Description: ${action.description.map((d) => d.text).join(" ")}, Action Extra Votes: ${action.votes}`,
	)
	.join("\n")}`,
	]
		.filter(Boolean)
		.join("\n");

	console.log(text);
	console.log("--------------------------------");

	// console.log("Embedding Round", count, allRounds.length);

	// const embedding = await embed({
	// 	model: openai.embedding("text-embedding-3-small"),
	// 	value: text,
	// });

	// await db.primary
	// 	.update(rounds)
	// 	.set({
	// 		embedding: embedding.embedding,
	// })
	// .where(eq(rounds.id, round.id));
}
