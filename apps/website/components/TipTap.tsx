import { generateHTML } from "@tiptap/html";
import RegexExtension from "@/components/RegexExtension";
import LinkExtension from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import { twMerge } from "tailwind-merge";
import type { JSONContent } from "@tiptap/core";

export default function TipTap(props: {
	content: JSONContent;
	className?: string;
}) {
	return (
		<div
			// biome-ignore lint/security/noDangerouslySetInnerHtml: props.content is already sanitized
			dangerouslySetInnerHTML={{
				__html: generateHTML(props.content, [
					StarterKit,
					LinkExtension.configure({
						protocols: ["http", "https"],
						HTMLAttributes: {
							class:
								"text-red cursor-pointer hover:opacity-80 transition-opacity",
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
				]),
			}}
			className={twMerge(
				"outline-none prose text-grey-200 prose-headings:font-normal prose-headings:text-white prose-headings:font-luckiest-guy prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-strong:font-bold prose-strong:text-white [&_li_p]:m-0 prose-li:m-0 ",
				props.className,
			)}
		/>
	);
}
