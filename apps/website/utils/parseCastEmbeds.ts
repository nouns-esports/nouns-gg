import type { getPosts } from "@/server/queries/posts";

export default function parseCastEmbeds(
	post: NonNullable<Awaited<ReturnType<typeof getPosts>>>[number],
) {
	let image: string | undefined;
	let video: string | undefined;

	for (const embeddedUrl of post.embeddedUrls ?? []) {
		if (
			[
				"supercast.mypinata.cloud",
				"ipfs.nouns.gg",
				"imagedelivery.net",
			].includes(embeddedUrl)
		) {
			image = embeddedUrl;
		}
	}

	return { image, video, round: post.round ?? undefined };
}
