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
	palette: string;
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
				buffer[cursor + 3] = getColor(input.palette, draw.colorIndex, cache); // fill color
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
		palette: `0x${string}`;
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
