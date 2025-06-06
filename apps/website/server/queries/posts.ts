import { unstable_cache as cache } from "next/cache";
import { neynarClient } from "../clients/neynar";

export const getPosts = cache(async (input: { parentUrl: string; }) => {
	return neynarClient.fetchFeed("filter", {
		filterType: "parent_url",
		parentUrl: input.parentUrl,
		limit: 25,
	}).then(posts => posts.casts.filter(cast => cast.author.fid !== 1090958))
}, ["posts"], { tags: ["posts"], revalidate: 60 * 10 })
