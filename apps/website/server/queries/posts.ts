import { db } from "~/packages/db";
import { casts, profiles, reactions } from "~/packages/db/schema/farcaster";
import { and, desc, eq, ilike, isNull, sql } from "drizzle-orm";
import { rounds } from "~/packages/db/schema/public";
import { unstable_cache as cache } from "next/cache";

export const getPosts = cache(
	async () => {
		return db.pgpool.query.casts.findMany({
			where: and(
				eq(casts.parentUrl, "https://nouns.gg"),
				isNull(casts.deletedAt),
			),
			orderBy: desc(casts.timestamp),
			limit: 100,
			with: {
				creator: true,
				community: true,
			},
			extras: {
				round: sql<typeof rounds.$inferSelect | null>`
     (
          SELECT row_to_json(r)
          FROM ${rounds} r
          WHERE r.handle = (
            SELECT substring(
              split_part(url, '?', 1)
              FROM '[^/]+$'
            )
            FROM unnest(${casts.embeddedUrls}) AS url
            WHERE url LIKE 'https://nouns.gg/rounds/%'
            LIMIT 1
          )
        )
    `.as("round"),
				mentionedProfiles: sql<(typeof profiles.$inferSelect)[] | null>`
      (
        SELECT json_agg(row_to_json(p))
        FROM unnest(${casts.mentions}) AS mention(fid)
        JOIN ${profiles} p ON p.fid = mention.fid
      )
    `.as("mentionedProfiles"),
				likesCount: sql<number>`
        (
          SELECT COUNT(*)::int 
          FROM ${reactions}
          WHERE reaction_type = 1
            AND target_hash = ${casts.hash}
        )
      `.as("likesCount"),
				recastsCount: sql<number>`
        (
          SELECT COUNT(*)::int
          FROM ${reactions}
          WHERE reaction_type = 0
            AND target_hash = ${casts.hash}
        )
      `.as("recastsCount"),
				commentsCount: sql<number>`
     (
       SELECT COUNT(*)::int
       FROM ${casts} AS child
       WHERE child.parent_hash = casts.hash  
     )
     `.as("commentsCount"),
			},
		});
	},
	["posts"],
	{ tags: ["posts"], revalidate: 60 * 5 },
);

export async function getPost(props: { hash: string }) {
	return db.primary.query.casts.findFirst({
		where: ilike(casts.hash, `${props.hash}%`),
		with: {
			creator: true,
			community: true,
		},
		extras: {
			round: sql<typeof rounds.$inferSelect | null>`
     (
          SELECT row_to_json(r)
          FROM ${rounds} r
          WHERE r.handle = (
            SELECT substring(
              split_part(url, '?', 1)
              FROM '[^/]+$'
            )
            FROM unnest(${casts.embeddedUrls}) AS url
            WHERE url LIKE 'https://nouns.gg/rounds/%'
            LIMIT 1
          )
        )
    `.as("round"),
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
			commentsCount: sql<number>`
        (
          SELECT COUNT(*)
          FROM ${casts}
          WHERE parent_hash = ${casts.hash}
        )
      `.as("commentsCount"),
		},
	});
}
