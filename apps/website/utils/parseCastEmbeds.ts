import type { getPosts } from "@/server/queries/posts";

export default function parseCastEmbeds(
	post: NonNullable<Awaited<ReturnType<typeof getPosts>>>[number],
) {
	let image: string | undefined;
	let video: string | undefined;

	for (const embeddedUrl of post.embeddedUrls ?? []) {
		if (
			embeddedUrl.includes("supercast.mypinata.cloud") ||
			embeddedUrl.includes("ipfs.nouns.gg") ||
			embeddedUrl.includes("imagedelivery.net") ||
			embeddedUrl.includes("i.imgur.com") ||
			embeddedUrl.includes(".jpg") ||
			embeddedUrl.includes(".png") ||
			embeddedUrl.includes(".gif") ||
			embeddedUrl.includes(".webp")
		) {
			image = embeddedUrl;
		}

		if (
			embeddedUrl.includes(".m3u8") ||
			embeddedUrl.includes("stream.warpcast.com") ||
			embeddedUrl.includes(".mp4")
		) {
			video = embeddedUrl;
		}
	}

	return { image, video, round: post.round ?? undefined };
}
