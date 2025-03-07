import { ponder } from "ponder:registry";
import {
	lilnounDelegates,
	nounDelegates,
	erc721Balances,
	// erc20Balances,
	// nounsProposals,
} from "../ponder.schema";
import { MarkdownParser, defaultMarkdownParser } from "@tiptap/pm/markdown";
import type { JSONContent } from "@tiptap/react";

ponder.on("NounsToken:Transfer", async ({ event, context }) => {
	await context.db
		.insert(erc721Balances)
		.values({
			account: event.args.to,
			collection: context.contracts.NounsToken.address,
			tokenId: event.args.tokenId,
		})
		.onConflictDoUpdate({
			account: event.args.to,
		});
});

ponder.on("LilNounsToken:Transfer", async ({ event, context }) => {
	await context.db
		.insert(erc721Balances)
		.values({
			account: event.args.to,
			collection: context.contracts.LilNounsToken.address,
			tokenId: event.args.tokenId,
		})
		.onConflictDoUpdate({
			account: event.args.to,
		});
});

ponder.on("NounsToken:DelegateChanged", async ({ event, context }) => {
	await context.db
		.insert(nounDelegates)
		.values({
			from: event.args.fromDelegate,
			to: event.args.toDelegate,
		})
		.onConflictDoUpdate({
			to: event.args.toDelegate,
		});
});

ponder.on("LilNounsToken:DelegateChanged", async ({ event, context }) => {
	await context.db
		.insert(lilnounDelegates)
		.values({
			from: event.args.fromDelegate,
			to: event.args.toDelegate,
		})
		.onConflictDoUpdate({
			to: event.args.toDelegate,
		});
});

// ponder.on("NounsDAOGovernor:ProposalCreated", async ({ event, context }) => {
// 	const startTime = await context.client.getBlock({
// 		blockNumber: event.args.startBlock,
// 	});
// 	const endTime = await context.client.getBlock({
// 		blockNumber: event.args.endBlock,
// 	});

// 	await context.db.insert(nounsProposals).values({
// 		id: event.args.id,
// 		proposer: event.args.proposer,
// 		targets: [...event.args.targets],
// 		values: [...event.args.values],
// 		signatures: [...event.args.signatures],
// 		calldatas: [...event.args.calldatas],
// 		description: event.args.description,
// 		startTime: new Date(Number(startTime.timestamp) * 1000),
// 		endTime: new Date(Number(endTime.timestamp) * 1000),
// 		createdAt: new Date(Number(event.block.timestamp) * 1000),
// 	});
// });

async function parseMarkdown(props: {
	markdown: string;
	onImage: (src: string) => Promise<string>;
}) {
	const parser = new MarkdownParser(
		defaultMarkdownParser.schema,
		defaultMarkdownParser.tokenizer,
		defaultMarkdownParser.tokens,
	);

	const json = parser.parse(props.markdown).toJSON();

	async function traverse(node: JSONContent) {
		if (node.type === "image" && node.attrs?.src) {
			node.attrs.src = await props.onImage(node.attrs.src);
		}

		// Convert node types from snake_case to camelCase for compatibility with Tiptap
		if (node.type === "list_item") {
			node.type = "listItem";
		}

		if (node.type === "bullet_list") {
			node.type = "bulletList";
		}

		if (node.type === "ordered_list") {
			node.type = "orderedList";
		}

		if (node.type === "hard_break") {
			node.type = "hardBreak";
		}

		if (node.type === "code_block") {
			node.type = "codeBlock";
		}

		if (node.type === "horizontal_rule") {
			node.type = "horizontalRule";
		}

		if (node.type === "blockquote") {
			node.type = "blockquote";
		}

		if (node.marks) {
			node.marks = node.marks.map((mark) => {
				if (mark.type === "em") {
					return { ...mark, type: "italic" };
				}
				if (mark.type === "strong") {
					return { ...mark, type: "bold" };
				}
				return mark;
			});
		}

		for (const child of node.content ?? []) {
			await traverse(child);
		}
	}

	await traverse(json);

	return json;
}
