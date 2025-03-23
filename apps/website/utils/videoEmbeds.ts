export function isVideoEmbed(link: string) {
	try {
		const url = new URL(link);

		console.log(url.pathname);

		if (
			url.pathname.includes("clips.twitch.tv") &&
			url.pathname.startsWith("/embed")
		) {
			return true;
		}

		if (
			url.hostname.includes("youtube.com") &&
			url.pathname.startsWith("/embed")
		) {
			return true;
		}

		if (
			url.hostname.includes("drive.google.com") &&
			url.pathname.endsWith("/preview")
		) {
			return true;
		}
	} catch {}

	return false;
}

export function videoEmbedFromLink(link: string) {
	try {
		const url = new URL(link);

		// User Input: https://clips.twitch.tv/BlueExquisiteBaconHeyGuys-vynEsLJMItjIbj9m
		// Output: https://clips.twitch.tv/embed?clip=BlueExquisiteBaconHeyGuys-vynEsLJMItjIbj9m&parent=nouns.gg
		if (url.hostname.includes("clips.twitch.tv")) {
			if (url.pathname.length > 1)
				return `https://clips.twitch.tv/embed?clip=${url.pathname.replace("/", "")}`;
		}

		// User Input: https://www.youtube.com/watch?v=sqRntu1k6AE
		// Output: https://www.youtube.com/embed/sqRntu1k6AE
		if (url.hostname.includes("youtube.com")) {
			if (url.searchParams.get("v") !== null) {
				return `https://www.youtube.com/embed/${url.searchParams.get("v")}`;
			}
		}

		// User Input: https://youtu.be/JSHu-GY3xwg?si=LkQpfQPVID5K1c4l
		// Output: https://www.youtube.com/embed/JSHu-GY3xwg
		if (url.hostname.includes("youtu.be")) {
			return `https://www.youtube.com/embed/${url.pathname.replace("/", "")}`;
		}

		// User Input: https://drive.google.com/file/d/1obXK4mr1yTVS7ruAWba__6k6D5b_ORgs/view
		// Output: https://drive.google.com/file/d/1obXK4mr1yTVS7ruAWba__6k6D5b_ORgs/preview
		if (url.hostname.includes("drive.google.com")) {
			return link.replace("/view", "/preview").split("?")[0];
		}
	} catch {}
}
