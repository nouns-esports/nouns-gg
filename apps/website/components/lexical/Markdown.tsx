"use client";

import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode } from "@lexical/rich-text";
import { ImageNode } from "./nodes/ImageNode";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { EditorState, LexicalEditor } from "lexical";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import ImagePlugin from "./plugins/ImagePlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { twMerge } from "tailwind-merge";

// THIS MUST BE DEFINED OUTSIDE OF THE COMPONENT OR YOU WILL WASTE HOURS OF YOUR LIFE TRYING TO FIGURE OUT WHY REACT FORCE FOCUSES THE LEXICAL EDITOR ON EVERY RERENDER
const MATCHERS = [
	(text: string) => {
		const URL_MATCHER =
			/((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

		const match = URL_MATCHER.exec(text);

		if (match === null) {
			return null;
		}

		const fullMatch = match[0];

		return {
			index: match.index,
			length: fullMatch.length,
			text: fullMatch,
			url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
			attributes: { rel: "noreferrer", target: "_blank" },
		};
	},
];

export default function Markdown(props: {
	markdown: string;
	readOnly: boolean;
	onChange?: (state: EditorState, editor: LexicalEditor) => void;
	className?: string;
}) {
	return (
		<LexicalComposer
			// key={props.markdown}
			initialConfig={{
				namespace: "Nouns Esports",
				theme: {},
				onError: (error) => {
					console.error(error);
				},
				editable: !props.readOnly,
				nodes: [
					LinkNode,
					AutoLinkNode,
					ListNode,
					ListItemNode,
					HeadingNode,
					ImageNode,
				],
				editorState: JSON.stringify({
					root: JSON.parse(props.markdown),
				}),
			}}
		>
			{!props.readOnly ? (
				<>
					<HistoryPlugin />
					<ToolbarPlugin />
					<OnChangePlugin onChange={props.onChange ?? (() => {})} />
					<TabIndentationPlugin />
				</>
			) : (
				""
			)}
			<RichTextPlugin
				contentEditable={
					<ContentEditable
						onKeyDown={(e) => {
							if (e.key === "Tab") {
								e.preventDefault();
							}
						}}
						className={twMerge(
							"outline-none flex flex-col h-full prose max-w-none",
							"prose-strong:text-white prose-a:text-red prose-p:text-grey-200 marker:text-grey-200 prose-p:leading-snug prose-headings:text-white prose-li:text-grey-200 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base",
							"prose-p:m-0 prose-p:mb-2 prose-h1:mb-4 prose-h2:mb-2 prose-h3:mb-2 prose-headings:mt-4 prose-ul:my-2 prose-ol:my-2 prose-li:m-0",
							"prose-img:rounded-xl prose-img:m-0",
							!props.readOnly && "ml-1 mt-2",
							props.className,
						)}
					/>
				}
				placeholder={
					<div className="text-grey-400 pointer-events-none absolute top-[51px] pl-1">
						Enter proposal here
					</div>
				}
				ErrorBoundary={LexicalErrorBoundary}
			/>
			<LinkPlugin />
			<AutoLinkPlugin matchers={MATCHERS} />
			<ListPlugin />
			<ImagePlugin />
		</LexicalComposer>
	);
}
