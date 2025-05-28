import type {
	CastEmbedded,
	CastWithInteractions,
} from "@neynar/nodejs-sdk/build/neynar-api/v2";

type ImageEmbed = { url: string; width: number; height: number };
type VideoEmbed = {
	url: string;
	duration: number;
};
type WebsiteEmbed = {
	url: string;
	image: string;
	title: string;
};
type FrameEmbed = { url: string; image: string };

export type CastEmbed = {
	cast: CastEmbedded;
	embeds: {
		image?: ImageEmbed;
		video?: VideoEmbed;
		website?: WebsiteEmbed;
		frame?: FrameEmbed;
	};
};

export default function parseCastEmbeds(
	embeds: CastWithInteractions["embeds"]
) {
	let image: ImageEmbed | undefined;
	let video: VideoEmbed | undefined;
	let website: WebsiteEmbed | undefined;
	let frame: FrameEmbed | undefined;
	let quoteCast: CastEmbed | undefined;

	for (const embed of embeds) {
		if ("url" in embed) {
			if (embed.metadata) {
				if (embed.metadata.image) {
					image = {
						url: embed.url,
						width: embed.metadata.image.width_px ?? 0,
						height: embed.metadata.image.height_px ?? 0,
					};
				}

				if (embed.metadata.video) {
					video = {
						url: embed.url,
						duration: embed.metadata.video.duration_s ?? 0,
					};
				}

				if (
					embed.metadata.html &&
					embed.metadata.html.ogTitle &&
					embed.metadata.html.ogImage
				) {
					website = {
						url: embed.url,
						image: embed.metadata.html.ogImage[0].url,
						title: embed.metadata.html.ogTitle,
					};
				}
			}
		}

		if ("cast" in embed) {
			let quoteImage: ImageEmbed | undefined;
			let quoteVideo: VideoEmbed | undefined;
			let quoteWebsite: WebsiteEmbed | undefined;
			let quoteFrame: FrameEmbed | undefined;

			if (embed.cast.embeds) {
				for (const quoteEmbed of embed.cast.embeds) {
					if ("url" in quoteEmbed) {
						if (quoteEmbed.metadata) {
							if (quoteEmbed.metadata.image) {
								quoteImage = {
									url: quoteEmbed.url,
									width: quoteEmbed.metadata.image.width_px ?? 0,
									height: quoteEmbed.metadata.image.height_px ?? 0,
								};
							}

							if (quoteEmbed.metadata.video) {
								quoteVideo = {
									url: quoteEmbed.url,
									duration: quoteEmbed.metadata.video.duration_s ?? 0,
								};
							}

							if (
								quoteEmbed.metadata.html &&
								quoteEmbed.metadata.html.ogTitle &&
								quoteEmbed.metadata.html.ogImage
							) {
								quoteWebsite = {
									url: quoteEmbed.url,
									image: quoteEmbed.metadata.html.ogImage[0].url,
									title: quoteEmbed.metadata.html.ogTitle,
								};
							}
						}
					}
				}

				quoteCast = {
					cast: embed.cast,
					embeds: {
						image: quoteImage,
						video: quoteVideo,
						website: quoteWebsite,
						frame: quoteFrame,
					},
				};
			}
		}
	}

	return { image, video, website, frame, quoteCast };
}