import { getArticle } from "@/server/queries/articles";
import { isUUID } from "@/utils/isUUID";
import { notFound, redirect } from "next/navigation";

export async function GET(request: Request) {
	const url = new URL(request.url);

	const params = {
		article: url.searchParams.get("article"),
	};

	if (!params.article) {
		return notFound();
	}

	if (isUUID(params.article)) {
		const article = await getArticle({ id: params.article });

		if (!article) {
			return notFound();
		}

		return redirect(
			`/c/${article.community.handle}/articles/${article.handle}`,
		);
	}

	const article = await getArticle({ handle: params.article });

	if (!article) {
		return notFound();
	}

	return redirect(`/c/${article.community.handle}/articles/${article.handle}`);
}
