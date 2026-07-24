import { Fragment, createElement, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type SerializedNode = {
	type?: string;
	text?: string;
	format?: number | string;
	tag?: string;
	listType?: string;
	url?: string;
	src?: string;
	altText?: string;
	children?: SerializedNode[];
};

export default function Markdown(props: {
	markdown: string;
	readOnly: boolean;
	onChange?: (...args: any[]) => void;
	className?: string;
}) {
	let root: SerializedNode | undefined;
	try {
		root = JSON.parse(props.markdown) as SerializedNode;
	} catch {
		root = { type: "paragraph", children: [{ type: "text", text: "" }] };
	}

	return (
		<div
			className={twMerge(
				"flex h-full max-w-none flex-col outline-none prose",
				"prose-strong:text-white prose-a:text-red prose-p:text-grey-200 marker:text-grey-200 prose-p:leading-snug prose-headings:text-white prose-li:text-grey-200 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base",
				"prose-p:m-0 prose-p:mb-2 prose-h1:mb-4 prose-h2:mb-2 prose-h3:mb-2 prose-headings:mt-4 prose-ul:my-2 prose-ol:my-2 prose-li:m-0",
				"prose-img:m-0 prose-img:rounded-xl",
				props.className,
			)}
		>
			{renderChildren(root)}
		</div>
	);
}

function renderChildren(node: SerializedNode): ReactNode {
	return node.children?.map((child, index) => (
		<Fragment key={index}>{renderNode(child)}</Fragment>
	));
}

function renderNode(node: SerializedNode): ReactNode {
	switch (node.type) {
		case "root":
			return renderChildren(node);
		case "text":
			return renderText(node);
		case "paragraph":
			return <p>{renderChildren(node)}</p>;
		case "heading":
			return createElement(
				/^h[1-6]$/.test(node.tag ?? "") ? (node.tag as string) : "h2",
				null,
				renderChildren(node),
			);
		case "quote":
			return <blockquote>{renderChildren(node)}</blockquote>;
		case "list":
			return node.listType === "number" ? (
				<ol>{renderChildren(node)}</ol>
			) : (
				<ul>{renderChildren(node)}</ul>
			);
		case "listitem":
			return <li>{renderChildren(node)}</li>;
		case "link":
		case "autolink":
			return (
				<a href={safeUrl(node.url)} target="_blank" rel="noopener noreferrer">
					{renderChildren(node)}
				</a>
			);
		case "image":
			return node.src ? (
				<img src={node.src} alt={node.altText ?? ""} className="max-w-lg" />
			) : null;
		case "linebreak":
			return <br />;
		case "horizontalrule":
			return <hr className="border-grey-500" />;
		case "tab":
			return "    ";
		default:
			return renderChildren(node);
	}
}

function renderText(node: SerializedNode): ReactNode {
	let content: ReactNode = node.text ?? "";
	const format = typeof node.format === "number" ? node.format : 0;
	if (format & 1) content = <strong>{content}</strong>;
	if (format & 2) content = <em>{content}</em>;
	if (format & 4) content = <s>{content}</s>;
	if (format & 8) content = <u>{content}</u>;
	if (format & 16) content = <code>{content}</code>;
	if (format & 32) content = <sub>{content}</sub>;
	if (format & 64) content = <sup>{content}</sup>;
	if (format & 128) content = <mark>{content}</mark>;
	return content;
}

function safeUrl(value: string | undefined) {
	if (!value) return "#";
	if (/^(https?:|mailto:)/i.test(value)) return value;
	return "#";
}
