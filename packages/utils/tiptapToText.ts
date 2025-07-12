import type { JSONContent as TipTap } from "@tiptap/core";

export function tiptapToText(node: TipTap): string {
	if ("text" in node && typeof node.text === "string") {
		return node.text;
	}
	if ("content" in node && Array.isArray(node.content)) {
		return node.content.map(tiptapToText).join("");
	}
	return "";
}
