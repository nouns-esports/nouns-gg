import Link from "@/components/Link";
import { getArticle } from "@/server/queries/articles";
import { getAuthenticatedUser } from "@/server/queries/users";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { env } from "~/env";
import TipTap from "@/components/TipTap";

export async function generateMetadata(props: {
	params: Promise<{ article: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const article = await getArticle({ handle: params.article });

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
		other: {
			"fc:frame": JSON.stringify({
				version: "next",
				imageUrl: article.image,
				button: {
					title: "Read Article",
					action: {
						type: "launch_frame",
						name: "Nouns GG",
						url: `${env.NEXT_PUBLIC_DOMAIN}/articles/${article.handle}`,
						splashImageUrl:
							"https://ipfs.nouns.gg/ipfs/bafkreia2vysupa4ctmftg5ro73igggkq4fzgqjfjqdafntylwlnfclziey",
						splashBackgroundColor: "#040404",
					},
				},
			}),
		},
	};
}

export default async function ArticlePage(props: {
	params: Promise<{ article: string }>;
}) {
	const params = await props.params;

	const article = await getArticle({ handle: params.article });

	if (!article || article.draft) {
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
					<TipTap content={article.content} />
				</div>
			</div>
		</div>
	);
}
