export type LexicalNode = {
	type: string;
	text?: string;
	children?: LexicalNode[];
	// ...other possible Lexical node properties
};

export function lexicalToText(node: LexicalNode): string {
	if (node.type === "text" && typeof node.text === "string") {
		return node.text;
	}
	if (Array.isArray(node.children)) {
		// Optionally, add newlines for block nodes like "paragraph"
		const text = node.children.map(lexicalToText).join("");
		if (node.type === "paragraph") {
			return text + "\n";
		}
		return text;
	}
	return "";
}
