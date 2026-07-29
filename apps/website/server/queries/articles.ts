import { articles } from "@/server/data/archive";

export async function getArticle(
	input:
		| { id: string }
		| { handle: string; community?: string },
) {
	return articles.find((article) =>
		"id" in input
			? article.id === input.id
			: article.handle === input.handle &&
				(!input.community ||
					article.community.id === input.community ||
					article.community.handle === input.community),
	);
}

export async function getArticles() {
	return articles;
}
