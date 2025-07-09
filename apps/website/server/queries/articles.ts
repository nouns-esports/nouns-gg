import { articles } from "~/packages/db/schema/public";
import { db } from "~/packages/db";
import { and, desc, eq, lt, sql } from "drizzle-orm";

export async function getArticle(
	input: { id: string } | { handle: string; community?: string },
) {
	return db.pgpool.query.articles.findFirst({
		where:
			"id" in input
				? eq(articles.id, input.id)
				: and(
						eq(articles.handle, input.handle),
						input.community
							? eq(
									articles.community,
									sql`(SELECT id FROM communities WHERE communities.handle = ${input.community})`,
								)
							: undefined,
					),

		with: {
			community: true,
		},
	});
}

export async function getArticles() {
	return db.pgpool.query.articles.findMany({
		where: and(lt(articles.publishedAt, new Date()), eq(articles.draft, false)),
		orderBy: desc(articles.publishedAt),
		limit: 4,
	});
}
