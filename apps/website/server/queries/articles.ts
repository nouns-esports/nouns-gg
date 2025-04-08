import { articles } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, desc, eq, lt } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

export const getArticle = cache(
	async (input: { handle: string }) => {
		return db.pgpool.query.articles.findFirst({
			where: eq(articles.handle, input.handle),
		});
	},
	["articles"],
	{ tags: ["articles"], revalidate: 60 * 10 },
);

export const getArticles = cache(
	async () => {
		return db.pgpool.query.articles.findMany({
			where: and(
				lt(articles.publishedAt, new Date()),
				eq(articles.draft, false),
			),
			orderBy: desc(articles.publishedAt),
			limit: 4,
		});
	},
	["articles"],
	{ tags: ["articles"], revalidate: 60 * 10 },
);
