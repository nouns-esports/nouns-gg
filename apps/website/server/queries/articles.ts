import { articles } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { desc, eq, lt } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getArticle = cache(
	async (input: { id: string }) => {
		/////////////////////
		return db.query.articles.findFirst({
			where: eq(articles.id, input.id),
		});
	},
	["articles"],
	{ tags: ["articles"], revalidate: 60 * 10 },
);

export const getArticles = cache(
	async () => {
		//
		return db.query.articles.findMany({
			where: lt(articles.publishedAt, new Date()),
			orderBy: desc(articles.publishedAt),
			limit: 4,
		});
	},
	["articles"],
	{ tags: ["articles"], revalidate: 60 * 10 },
);
