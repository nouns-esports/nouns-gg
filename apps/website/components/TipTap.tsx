import { generateHTML } from "@tiptap/html";
import LinkExtension from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { twMerge } from "tailwind-merge";
import { type JSONContent } from "@tiptap/core";
import Youtube from "@tiptap/extension-youtube";
import EmoteExtension from "./EmoteExtension";

const extensions = [
	StarterKit,
	LinkExtension.configure({
		protocols: ["http", "https"],
		HTMLAttributes: {
			class:
				"text-red cursor-pointer hover:opacity-80 transition-opacity no-underline break-all relative z-10",
			rel: "noopener noreferrer",
		},
		autolink: true,
		linkOnPaste: true,
	}),
	Image.configure({
		HTMLAttributes: {
			class: "rounded-xl pointer-events-auto",
		},
	}),
	Youtube.configure({
		nocookie: true,
		// @ts-ignore
		width: "auto",
		// @ts-ignore
		height: "auto",
		HTMLAttributes: {
			class: "w-full aspect-video rounded-xl",
		},
	}),
	EmoteExtension({
		pattern: /⌐◨-◨/g,
	}),
];

export default function TipTap(props: {
	content: JSONContent | string;
	className?: string;
}) {
	return (
		<div
			// biome-ignore lint/security/noDangerouslySetInnerHtml: props.content is already sanitized
			dangerouslySetInnerHTML={{
				__html: generateHTML(
					typeof props.content === "string"
						? textToTipTap(props.content)
						: props.content,
					extensions,
				),
			}}
			className={twMerge(
				"outline-none prose text-grey-200 prose-headings:font-normal prose-headings:text-white prose-headings:font-luckiest-guy prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-strong:font-bold prose-strong:text-white [&_li_p]:m-0 prose-li:m-0 prose-a:no-underline max-w-none",
				props.className,
			)}
		/>
	);
}
export function textToTipTap(text: string) {
	const splitRegex = new RegExp(
		[
			"(https?:\\/\\/[^\\s]+)", // full URLs
			"|([A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)*\\.[A-Za-z]{2,}(?:\\/[^\\s]*)?)", // bare domains
			"|(@[A-Za-z0-9_]+)", // @handles
			"|(\\/[A-Za-z0-9-]+)", // channel slugs
			"|(:[A-Za-z0-9_+\\-]+:|⌐◨-◨)", // emote codes (:anything: or ⌐◨-◨)
		].join(""),
		"g",
	);

	const isUrl =
		/^(https?:\/\/[^\s]+|[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}(?:\/[^\s]*)?)$/;
	const isHandle = /^@[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*$/;
	const isChannel = /^\/[a-z-]+$/;
	const isEmote = /^(?::[A-Za-z0-9_+\-]+:|⌐◨-◨)$/;

	const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");

	return {
		type: "doc",
		content: lines.map((line) => {
			const parts = line.split(splitRegex).filter(Boolean);
			const content: any[] = [];

			for (const part of parts) {
				if (isUrl.test(part)) {
					const href = part.startsWith("http") ? part : `https://${part}`;
					content.push({
						type: "text",
						text: part,
						marks: [{ type: "link", attrs: { href } }],
					});
				} else if (isHandle.test(part)) {
					const username = part.slice(1);
					content.push({
						type: "text",
						text: part,
						marks: [
							{
								type: "link",
								attrs: { href: `https://farcaster.xyz/${username}` },
							},
						],
					});
				} else if (isChannel.test(part)) {
					const channel = part.slice(1);
					content.push({
						type: "text",
						text: part,
						marks: [
							{
								type: "link",
								attrs: { href: `https://farcaster.xyz/~/channel/${channel}` },
							},
						],
					});
				} else if (isEmote.test(part)) {
					content.push({
						type: "EmoteExtension",
						attrs: { title: part },
					});
				} else {
					content.push({ type: "text", text: part });
				}
			}

			return { type: "paragraph", content };
		}),
	};
}
