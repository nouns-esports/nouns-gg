import {
	Node,
	mergeAttributes,
	nodeInputRule,
	nodePasteRule,
} from "@tiptap/core";

export default function EmoteExtension(options: {
	pattern: RegExp;
}) {
	return Node.create({
		name: "EmoteExtension",
		inline: true,
		group: "inline",
		atom: true,

		addAttributes() {
			return {
				src: {
					default:
						"https://ipfs.nouns.gg/ipfs/QmQQGnQEarwqHc2VQeQhEtKwnyjXSBqpAyZKhjhhSusY4i",
				},
				title: { default: ":noggles:" },
				class: {
					default:
						"relative z-10 inline-flex my-0 mx-1 h-[1em] pointer-events-auto",
				},
			};
		},

		parseHTML() {
			return [
				{
					tag: `img.${this.name}`,
				},
			];
		},

		renderHTML({ HTMLAttributes }) {
			return ["img", mergeAttributes(HTMLAttributes, { class: this.name })];
		},

		addInputRules() {
			return [
				nodeInputRule({
					find: options.pattern,
					type: this.type,
					getAttributes: () => ({}),
				}),
			];
		},

		addPasteRules() {
			return [
				nodePasteRule({
					find: options.pattern,
					type: this.type,
					getAttributes: () => ({}),
				}),
			];
		},
	});
}
