"use client";

import {
	useEditor,
	EditorContent,
	type Editor,
	type Content,
} from "@tiptap/react";
import RegexExtension from "./RegexExtension";
import LinkExtension from "@tiptap/extension-link";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";

export function useMarkdownEditor(props?: Parameters<typeof useEditor>[0]) {
	return useEditor({
		...props,
		extensions: [
			Document,
			Text,
			Paragraph,
			Bold,
			Italic,
			ListItem,
			BulletList,
			OrderedList,
			LinkExtension.configure({
				protocols: ["http", "https"],
				HTMLAttributes: {
					class: "text-red cursor-pointer hover:opacity-80 transition-opacity",
					rel: "noopener noreferrer",
				},
				autolink: true,
				linkOnPaste: true,
			}),
			RegexExtension({
				name: "AutoLinkExtension",
				pattern:
					/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
				href: (url) => url,
			}),
			Image.configure({
				HTMLAttributes: {
					class: "rounded-xl pointer-events-auto",
				},
			}),
			Heading.configure({
				levels: [1, 2, 3, 4],
			}),
		],
		immediatelyRender: true,
		editorProps: {
			attributes: {
				class:
					"outline-none prose text-grey-200 prose-headings:font-normal prose-headings:text-white prose-headings:font-luckiest-guy prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-strong:font-bold prose-strong:text-white [&_li_p]:m-0 prose-li:m-0 ",
			},
		},
	});
}

export default function MarkdownTipTap({
	content,
	...props
}: {
	editor?: Editor | null;
	className?: string;
	content?: Content;
}) {
	const editor = useMarkdownEditor({ content, editable: false });

	if (typeof window === "undefined") {
		return null;
	}

	if (!props.editor) {
		return <EditorContent {...props} editor={editor} />;
	}

	return <EditorContent {...props} editor={props.editor} />;
}
