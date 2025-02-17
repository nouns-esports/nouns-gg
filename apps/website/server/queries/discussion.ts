import { neynarClient } from "../clients/neynar";
import { unstable_cache as cache } from "next/cache";

export const getTrendingPosts = cache(
	async () => {
		const responses = await Promise.all([
			neynarClient.fetchFeed("filter", {
				limit: 5,
				filterType: "channel_id",
				channelId: "nouns-esports",
			}),
			neynarClient.fetchFeed("filter", {
				limit: 5,
				filterType: "channel_id",
				channelId: "cs2",
			}),
			neynarClient.fetchFeed("filter", {
				limit: 5,
				filterType: "channel_id",
				channelId: "smash",
			}),
			neynarClient.fetchFeed("filter", {
				limit: 5,
				filterType: "channel_id",
				channelId: "dota2",
			}),
		]);

		const posts = responses.flatMap((response) => response.casts.flat());

		const filtered = posts
			.filter((post) => {
				if (post.text.length < 1) return false;
				if (!post.channel) return false;
				if (post.author.username === "esports") return false;

				return true;
			})
			.sort((a, b) => b.reactions.likes_count - a.reactions.likes_count);

		return filtered;
	},
	["discussion"],
	{ tags: ["discussion"], revalidate: 60 * 60 * 24 },
);
