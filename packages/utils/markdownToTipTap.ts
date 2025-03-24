import { MarkdownParser, defaultMarkdownParser } from "@tiptap/pm/markdown";
import type { JSONContent } from "@tiptap/react";

export async function markdownToTipTap(props: {
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
		if (node.type === "list_item") node.type = "listItem";
		if (node.type === "bullet_list") node.type = "bulletList";
		if (node.type === "ordered_list") node.type = "orderedList";
		if (node.type === "hard_break") node.type = "hardBreak";
		if (node.type === "code_block") node.type = "codeBlock";
		if (node.type === "horizontal_rule") node.type = "horizontalRule";

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

	return json as JSONContent;
}
