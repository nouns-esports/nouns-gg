import { imageFontData } from "./image-fonts.generated";

const imageFonts = [
	{ name: "Cabin", file: "Cabin-Regular.ttf" },
	{ name: "Luckiest Guy", file: "LuckiestGuy-Regular.ttf" },
	{ name: "Bebas Neue", file: "BebasNeue-Regular.ttf" },
	{ name: "Londrina Solid", file: "LondrinaSolid-Regular.ttf" },
] as const;

export function loadImageFonts() {
	return imageFonts.map((font) => ({
		name: font.name,
		data: decodeBase64(imageFontData[font.file]),
		weight: 400 as const,
		style: "normal" as const,
	}));
}

function decodeBase64(value: string) {
	return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
		.buffer;
}
