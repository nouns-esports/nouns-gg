"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import RegexExtension from "./RegexExtension";
import LinkExtension from "@tiptap/extension-link";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Image from "@tiptap/extension-image";
import EmoteExtension from "./EmoteExtension";

const tokens: Record<string, string> = {
	nouns: "0x0a93a7be7e7e426fc046e204c44d6b03a302b631",
	higher: "",
	degen: "",
	eth: "",
	usdc: "",
};

const vanityUrls: Record<string, string> = {
	"/rounds": "Rounds",
	"/quests": "Quests",
};

const vanityHandles: Record<string, string> = {
	"@matchaxyz": "Matcha",
	"@esports": "Nouns Esports",
};

export function useCastTextEditor(props?: Parameters<typeof useEditor>[0]) {
	return useEditor({
		...props,
		extensions: [
			Document,
			Text,
			Paragraph,
			// LinkExtension.configure({
			// 	protocols: ["http", "https"],
			// 	HTMLAttributes: {
			// 		class: "text-red cursor-pointer hover:opacity-80 transition-opacity",
			// 		rel: "noopener noreferrer",
			// 	},
			// 	autolink: true,
			// 	linkOnPaste: true,
			// }),
			RegexExtension({
				name: "AutoLinkExtension",
				pattern:
					/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
				href: (url) => url,
			}),

			RegexExtension({
				name: "HandleExtension",
				pattern: /@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)?/g,
				href: (value) => `/users/${value.replace("@", "")}`,
				render: (value) => {
					if (value in vanityHandles) {
						return vanityHandles[value];
					}

					return value;
				},
			}),
			RegexExtension({
				name: "TokenExtension",
				pattern: /\$[a-zA-Z]+/g,
				href: (value) => {
					const token = value.replace("$", "").toLowerCase();

					if (token in tokens) {
						return `/matcha/tokens/base/${tokens[token]}`;
					}

					return "/matcha";
				},
			}),
			RegexExtension({
				name: "ChannelExtension",
				pattern: /(?:^|\s)\/[a-zA-Z-]+/g,
				href: (value) =>
					`https://farcaster.xyz/~/channel/${value.replace("/", "")}`,
			}),
			EmoteExtension({
				pattern: /⌐◨-◨/g,
			}),
			Image.configure({
				HTMLAttributes: {
					class: "rounded-md pointer-events-auto",
				},
			}),
		],
		immediatelyRender: true,
		editorProps: {
			attributes: {
				class: "outline-none text-white",
			},
		},
	});
}

export default function CastText({
	children,
	...props
}: {
	editor?: Editor | null;
	className?: string;
	children?: string;
}) {
	const editor = useCastTextEditor({ content: children, editable: false });

	if (typeof window === "undefined") {
		return null;
	}

	if (!props.editor) {
		return <EditorContent {...props} editor={editor} />;
	}

	return <EditorContent {...props} editor={props.editor} />;
}
