// Use the provided palette (remove the "0x" prefix for easier substring handling)
const PALETTE =
	"000000c5b9a1ffffffcfc2ab63a0f9807f7ecaeff95648ed5a423fb9185ccbc1bcb87b11fffdf24b49493432351f1d29068940867c1dae32089f21a0f98f30fe500cd26451fd8b5b5a65fad22209e9265cc54e3880a72d4bea6934ac80eed81162616dff638d8bc0c5c4da53000000f3322cffae1affc110505a5cffef16fff671fff449db8323df2c39f938d85c25fb2a86fd45faff38dd56ff3a0ed32a099037076e3206552e05e8705bf38b7ce4a499667af9648df97cc4f297f2fba3efd087e4d971bde4ff1a0bf78a182b83f6d62149834398ffc925d9391fbd2d24ff7216254efbe5e5de00a556c5030eabf131fb4694e7a32cfff0ee009c590385eb00499ce1183326b1f3fff0bed8dadfd7d3cd1929f4eab1180b5027f9f5cbcfc9b8feb9d5f8d6895d606176858b757576ff0e0e0adc4dfdf8ff70e890f7913dff1ad2ff82ad535a15fa6fe2ffe939ab36beadc8cc604666f20422abaaa84b65f7a19c9a58565cda42cb027c92cec189909b0e74580d027ee6b2958defad817d635eeff2fa6f597ad4b7b2d18687cd916d6b3f394d271b85634ff9f4e6f8ddb0b92b3cd08b11257ceda3baed5fd4fbc16710a28ef43a085b67b1e31e3445ffd067962236769ca95a6b7b7e5243a86f608f785ecc059542ffb0d56333b8ced2f39713e8e8e2ec5b43235476b2a8a5d6c3be49b38bfccf25f59b34375dfc99e6de27a463554543b19e00d4a0159f4b27f9e8dd6b72129d8e6e4243f8fa5e20f82905555353876f69410d66552d1df71248fee3f3c169232b28340079fcd31e14f830018dd122fffdf4ffa21ee4afa3fbc311aa940ceedc00fff0069cb4b8a38654ae6c0a2bb26be2c8c0f89865f86100dcd8d3049d43d0aea9f39d44eeb78cf9f5e95d3500c3a199aaa6a4caa26afde7f5fdf008fdcef2f681e6018146d19a549eb5e1f5fcff3f932300fcff4a5358fbc800d596a6ffb913e9ba12767c0ef9f6d1d29607f8ce47395ed1ffc5f0d4cfc0";

// A lookup array that maps a number (0 to 32) to a coordinate value (multiplied by 10)
// This mirrors the Solidity lookup: [ '0', '10', '20', …, '320' ]
const lookup: string[] = Array.from({ length: 33 }, (_, i) =>
	(i * 10).toString(),
);

/**
 * Converts a hex string (with or without a leading "0x") to an array of byte numbers.
 */
function hexToBytes(hex: string): number[] {
	if (hex.startsWith("0x") || hex.startsWith("0X")) {
		// biome-ignore lint/style/noParameterAssign: stfu
		hex = hex.slice(2);
	}
	const bytes: number[] = [];
	for (let i = 0; i < hex.length; i += 2) {
		bytes.push(parseInt(hex.substr(i, 2), 16));
	}
	return bytes;
}

/**
 * Decodes an RLE compressed image (given as a byte array) into its bounds and draw instructions.
 * The first 5 bytes encode bounds (note that byte 0 is ignored) and subsequent bytes come in pairs:
 * [length, colorIndex].
 */
function decodeRLEImage(imageBytes: number[]): {
	bounds: { top: number; right: number; bottom: number; left: number };
	draws: { length: number; colorIndex: number }[];
} {
	const bounds = {
		top: imageBytes[1],
		right: imageBytes[2],
		bottom: imageBytes[3],
		left: imageBytes[4],
	};
	const draws: { length: number; colorIndex: number }[] = [];
	for (let i = 5; i < imageBytes.length; i += 2) {
		draws.push({ length: imageBytes[i], colorIndex: imageBytes[i + 1] });
	}
	return { bounds, draws };
}

/**
 * Given the current x-coordinate, the remaining length of a draw, and the right bound,
 * return the length (number of pixels) for a single SVG rectangle.
 */
function getRectLength(
	currentX: number,
	drawLength: number,
	rightBound: number,
): number {
	const remainingPixelsInLine = rightBound - currentX;
	return drawLength <= remainingPixelsInLine
		? drawLength
		: remainingPixelsInLine;
}

/**
 * Returns a color hex string (6 characters) for the given color index.
 * Colors are “cached” so that the palette is only parsed once per index.
 */
function getColor(palette: string, index: number, cache: string[]): string {
	if (!cache[index]) {
		const offset = 2;
		const pos = offset + index * 6;
		cache[index] = palette.substr(pos, 6);
	}
	return cache[index];
}
/**
 * Converts groups of 4 strings from the buffer into SVG <rect> elements.
 */
function getChunk(cursor: number, buffer: string[]): string {
	let chunk = "";
	for (let i = 0; i < cursor; i += 4) {
		// Each group represents:
		// [width, x, y, fill color]
		chunk += `<rect width="${buffer[i]}" height="10" x="${buffer[i + 1]}" y="${buffer[i + 2]}" fill="#${buffer[i + 3]}" />`;
	}
	return chunk;
}

/**
 * Processes one hex image data string into an SVG fragment (a series of <rect> elements).
 * This function mirrors the Solidity _generateSVGRects logic for a single Part.
 */
export function generateSVGPart(input: {
	image: string;
	palette?: string;
}): string {
	const imageBytes = hexToBytes(input.image);
	const decoded = decodeRLEImage(imageBytes);
	const { top, right, left } = decoded.bounds;

	let currentX = left;
	let currentY = top;
	let rects = "";
	const cache: string[] = new Array(256).fill("");
	const buffer: string[] = new Array(16).fill("");
	let cursor = 0;

	for (const draw of decoded.draws) {
		let remainingLength = draw.length;
		while (remainingLength > 0) {
			const rectLength = getRectLength(currentX, remainingLength, right);
			if (draw.colorIndex !== 0) {
				buffer[cursor] = lookup[rectLength]; // width
				buffer[cursor + 1] = lookup[currentX]; // x
				buffer[cursor + 2] = lookup[currentY]; // y
				buffer[cursor + 3] = getColor(
					input.palette ?? PALETTE,
					draw.colorIndex,
					cache,
				); // fill color
				cursor += 4;

				if (cursor >= 16) {
					rects += getChunk(cursor, buffer);
					cursor = 0;
				}
			}
			currentX += rectLength;
			if (currentX === right) {
				currentX = left;
				currentY++;
			}
			remainingLength -= rectLength;
		}
	}
	if (cursor !== 0) {
		rects += getChunk(cursor, buffer);
	}
	return rects;
}

/**
 * Given an array of hex image data strings, returns an array of SVG fragments (each being a series
 * of <rect> elements) that mirror the output of the Solidity generateSVGParts function.
 */
export function generateSVGParts(
	parts: readonly {
		image: `0x${string}`;
		palette?: `0x${string}`;
	}[],
): {
	body: string;
	accessory: string;
	head: string;
	glasses: string;
} {
	const svgs = parts.map(generateSVGPart);

	return {
		body: svgs[0],
		accessory: svgs[1],
		head: svgs[2],
		glasses: svgs[3],
	};
}
