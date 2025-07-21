import { embed } from "ai";
import { db } from "..";
import { eq, isNull } from "drizzle-orm";
import { proposals } from "../schema/public";
import {
	lexicalToText,
	type LexicalNode,
} from "~/packages/utils/lexicalToText";
import { openai } from "@ai-sdk/openai";

const allProposals = await db.primary.query.proposals.findMany({
	where: isNull(proposals.embedding),
	with: {
		round: {
			with: {
				event: true,
				community: true,
			},
		},
		user: true,
	},
});

let count = 0;
for (const proposal of allProposals) {
	count++;

	const text = [
		`Proposal Title: ${proposal.title}`,
		proposal.content
			? `Proposal Description: ${lexicalToText(
					JSON.parse(proposal.content) as LexicalNode,
				)}`
			: null,
		proposal.user ? `Proposal Author Name: ${proposal.user.name}` : null,
		proposal.round?.event?.name
			? `Proposal Event Name: ${proposal.round.event.name}`
			: null,
		proposal.round?.event?.handle
			? `Proposal Event Handle: ${proposal.round.event.handle}`
			: null,
		proposal.round?.community?.name
			? `Proposal Community Name: ${proposal.round.community.name}`
			: null,
		proposal.round?.community?.handle
			? `Proposal Community Handle: ${proposal.round.community.handle}`
			: null,
	]
		.filter(Boolean)
		.join("\n");

	console.log("Embedding Proposal", count, allProposals.length);

	const embedding = await embed({
		model: openai.embedding("text-embedding-3-small"),
		value: text,
	});

	await db.primary
		.update(proposals)
		.set({
			embedding: embedding.embedding,
		})
		.where(eq(proposals.id, proposal.id));
}
