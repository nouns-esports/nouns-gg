import { db } from "~/packages/db";
import { casts, profiles, reactions } from "~/packages/db/schema/farcaster";
import { and, desc, eq, ilike, is, isNotNull, isNull, sql } from "drizzle-orm";
import { rounds } from "~/packages/db/schema/public";
import { unstable_cache as cache } from "next/cache";

export const getPosts = cache(
	async (input: {
		parentUrl?: string;
		fid?: number;
	}) => {
		return db.pgpool.query.casts.findMany({
			where: and(
				isNotNull(casts.parentUrl),
				input.parentUrl ? eq(casts.parentUrl, input.parentUrl) : undefined,
				input.fid ? eq(casts.fid, input.fid) : undefined,
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
				quotedPosts,
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
			quotedPosts,
		},
	});
}

const quotedPosts = sql<
	| (typeof casts.$inferSelect & {
			mentionedProfiles: (typeof profiles.$inferSelect)[] | null;
			creator: typeof profiles.$inferSelect | null;
	  })[]
	| null
>`
(
SELECT json_agg(row_to_json(q))
FROM (
  SELECT
    -- cast fields (camelCased) with bytea → 0xhex
    c.id,
    c.created_at        AS "createdAt",
    c.updated_at        AS "updatedAt",
    c.deleted_at        AS "deletedAt",
    c.timestamp,
    c.fid,
    concat('0x', encode(c.hash, 'hex'))                       AS "hash",
    c.text,
    concat('0x', encode(c.parent_hash, 'hex'))                AS "parentHash",
    c.parent_fid                                               AS "parentFid",
    c.parent_url                                              AS "parentUrl",
    concat('0x', encode(c.root_parent_hash, 'hex'))           AS "rootParentHash",
    c.root_parent_url                                         AS "rootParentUrl",
    c.embedded_urls                                           AS "embeddedUrls",
    (SELECT json_agg(concat('0x', encode(x, 'hex')))
       FROM unnest(c.embedded_casts) AS x)                    AS "embeddedCasts",
    c.mentions,
    c.mentions_positions                                     AS "mentionsPositions",
    c.ticker_mentions                                        AS "tickerMentions",
    c.ticker_mentions_positions                              AS "tickerMentionsPositions",
    c.channel_mentions                                       AS "channelMentions",
    c.channel_mentions_positions                             AS "channelMentionsPositions",
    c.embedded_casts_fids                                    AS "embeddedCastsFids",
    c.embeds,
    c.creator_app_fid                                        AS "creatorAppFid",
    c.deleter_app_fid                                        AS "deleterAppFid",

    -- extras
    coalesce(mp.profiles, '[]')::jsonb                       AS "mentionedProfiles",
    cr.profile                                              AS "creator"
  FROM unnest(${casts.embeddedCasts}) AS quoted(hash)
  JOIN ${casts} c
    ON c.hash = quoted.hash

  -- mentionedProfiles sub-query, with its own bytea → 0xhex
  LEFT JOIN LATERAL (
    SELECT json_agg(row_to_json(pq)) AS profiles
    FROM (
      SELECT
        p.id,
        p.created_at           AS "createdAt",
        p.updated_at           AS "updatedAt",
        p.deleted_at           AS "deletedAt",
        p.fid,
        p.bio,
        p.pfp_url              AS "pfpUrl",
        p.url,
        p.username,
        p.display_name         AS "displayName",
        p.location,
        p.latitude,
        p.longitude,
        concat('0x', encode(p.primary_eth_address, 'hex'))   AS "primaryEthAddress",
        concat('0x', encode(p.primary_sol_address, 'hex'))   AS "primarySolAddress"
      FROM unnest(c.mentions) AS mention(fid)
      JOIN ${profiles} p
        ON p.fid = mention.fid
    ) pq
  ) mp ON true

  -- creator sub-query, with its own bytea → 0xhex
  LEFT JOIN LATERAL (
    SELECT row_to_json(cr) AS profile
    FROM (
      SELECT
        p.id,
        p.created_at           AS "createdAt",
        p.updated_at           AS "updatedAt",
        p.deleted_at           AS "deletedAt",
        p.fid,
        p.bio,
        p.pfp_url              AS "pfpUrl",
        p.url,
        p.username,
        p.display_name         AS "displayName",
        p.location,
        p.latitude,
        p.longitude,
        concat('0x', encode(p.primary_eth_address, 'hex'))   AS "primaryEthAddress",
        concat('0x', encode(p.primary_sol_address, 'hex'))   AS "primarySolAddress"
      FROM ${profiles} p
      WHERE p.fid = c.fid
    ) cr
  ) cr ON true

) AS q
)
`.as("quotedPosts");
