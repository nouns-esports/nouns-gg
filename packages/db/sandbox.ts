import { eq, desc, sql } from "drizzle-orm";
import { db } from ".";
import { casts, reactions } from "./schema/farcaster";
import { rounds } from "./schema/public";

const posts = await db.pgpool.query.casts.findMany({
	where: eq(casts.fid, 11500),
	limit: 10,
	orderBy: [desc(casts.createdAt)],
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
      SELECT substring(url FROM '[^/]+$')
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

console.log(posts);
