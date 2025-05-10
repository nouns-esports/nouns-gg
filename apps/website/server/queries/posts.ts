import { db } from "~/packages/db";
import { casts, reactions } from "~/packages/db/schema/farcaster";
import { desc, eq, ilike, sql } from "drizzle-orm";

export async function getPosts() {
	return db.primary.query.casts.findMany({
		where: eq(casts.parentUrl, "https://nouns.gg"),
		orderBy: desc(casts.timestamp),
		limit: 10,
		with: {
			creator: true,
			community: true,
		},
		extras: {
			likesCount: sql<number>`
        (
          SELECT COUNT(*) 
          FROM ${reactions}
          WHERE reaction_type = 1
            AND target_hash = ${casts.hash}
        )
      `.as("likesCount"),
			recastsCount: sql<number>`
        (
          SELECT COUNT(*) 
          FROM ${reactions}
          WHERE reaction_type = 0
            AND target_hash = ${casts.hash}
        )
      `.as("recastsCount"),
		},
	});
}

export async function getPost(props: { hash: string }) {
	return db.primary.query.casts.findFirst({
		where: ilike(casts.hash, `${props.hash}%`),
		with: {
			creator: true,
		},
		extras: {
			likesCount: sql<number>`
        (
          SELECT COUNT(*)
          FROM ${reactions}
          WHERE reaction_type = 1
            AND target_hash = ${casts.hash}
        )
      `.as("likesCount"),
			recastsCount: sql<number>`
        (
          SELECT COUNT(*)
          FROM ${reactions}
          WHERE reaction_type = 0
            AND target_hash = ${casts.hash}
        )
      `.as("recastsCount"),
		},
	});
}
