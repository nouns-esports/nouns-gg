import Link from "@/components/Link";
import { getArticle } from "@/server/queries/articles";
import { getAuthenticatedUser } from "@/server/queries/users";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "~/env";
import { generateHTML } from "@tiptap/html";
import RegexExtension from "@/components/RegexExtension";
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

export async function generateMetadata(props: {
	params: Promise<{ article: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const article = await getArticle({ id: params.article });

	if (!article) {
		return notFound();
	}

	return {
		title: article.title,
		description: null,
		metadataBase: new URL(env.NEXT_PUBLIC_DOMAIN),
		openGraph: {
			type: "website",
			images: [article.image],
		},
		twitter: {
			site: "@NounsEsports",
			card: "summary_large_image",
			images: [article.image],
		},
	};
}

export default async function ArticlePage(props: {
	params: Promise<{ article: string }>;
}) {
	const params = await props.params;

	const [article, user] = await Promise.all([
		getArticle({ id: params.article }),
		getAuthenticatedUser(),
	]);

	if (!article) {
		return notFound();
	}

	const now = new Date();

	if (
		new Date(article.publishedAt) > now &&
		(!user || !article.editors.includes(user.id))
	) {
		return notFound();
	}

	return (
		<div className="flex flex-col items-center gap-8 pt-32 max-xl:pt-28 max-sm:pt-20 px-32 max-2xl:px-16 max-xl:px-8 max-sm:px-4">
			<div className="flex flex-col gap-4 max-w-3xl">
				<Link href="/" className="text-red flex items-center gap-1 group w-fit">
					<ArrowLeft className="w-5 h-5 text-red group-hover:-translate-x-1 transition-transform" />
					Back to home
				</Link>
				<img
					src={article.image}
					alt={article.title}
					className="aspect-video rounded-xl object-cover max-h-64"
				/>
				<div className="flex flex-col gap-4">
					<h1 className="text-4xl text-white font-luckiest-guy">
						{article.title}
					</h1>
					<div
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{
							__html: generateHTML(article.content, [
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
								Heading.configure({
									levels: [1, 2, 3, 4],
								}),
							]),
						}}
						className="outline-none prose text-grey-200 prose-headings:font-normal prose-headings:text-white prose-headings:font-luckiest-guy prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-strong:font-bold prose-strong:text-white [&_li_p]:m-0 prose-li:m-0 "
					/>
				</div>
			</div>
		</div>
	);
}
