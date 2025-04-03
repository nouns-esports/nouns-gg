import { DOMParser, XMLSerializer } from "xmldom";

export function unpadSVG(svgString: string): {
	svg: string;
	left: number;
	top: number;
	right: number;
	bottom: number;
} {
	// Parse the SVG string into a document.
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgString, "image/svg+xml");
	const svgElements = doc.getElementsByTagName("svg");
	if (!svgElements.length) {
		throw new Error("Invalid SVG string");
	}
	const svg = svgElements[0];

	// For elements, we need to use getElementsByTagName instead of querySelectorAll
	const elements = Array.from(svg.getElementsByTagName("*")).filter(el => 
		el.hasAttribute("x") && 
		el.hasAttribute("y") && 
		el.hasAttribute("width") && 
		el.hasAttribute("height")
	);

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	// biome-ignore lint/complexity/noForEach: <explanation>
	elements.forEach((el) => {
		const x = parseFloat(el.getAttribute("x") || "0");
		const y = parseFloat(el.getAttribute("y") || "0");
		const width = parseFloat(el.getAttribute("width") || "0");
		const height = parseFloat(el.getAttribute("height") || "0");

		// Update the bounding box.
		if (x < minX) minX = x;
		if (y < minY) minY = y;
		if (x + width > maxX) maxX = x + width;
		if (y + height > maxY) maxY = y + height;
	});

	// Retrieve the original SVG width and height.
	const origWidth = parseFloat(svg.getAttribute("width") || "0");
	const origHeight = parseFloat(svg.getAttribute("height") || "0");

	// Calculate the shifts needed.
	const leftShift = minX;
	const topShift = minY;
	const rightShift = origWidth - maxX;
	const bottomShift = origHeight - maxY;

	// Shift each element by subtracting the left and top shifts.
	// biome-ignore lint/complexity/noForEach: <explanation>
	elements.forEach((el) => {
		const x = parseFloat(el.getAttribute("x") || "0");
		const y = parseFloat(el.getAttribute("y") || "0");
		el.setAttribute("x", (x - leftShift).toString());
		el.setAttribute("y", (y - topShift).toString());
	});

	// Update the SVG viewBox and dimensions so that it tightly encloses the content.
	const newWidth = maxX - minX;
	const newHeight = maxY - minY;
	svg.setAttribute("viewBox", `0 0 ${newWidth} ${newHeight}`);
	svg.setAttribute("width", newWidth.toString());
	svg.setAttribute("height", newHeight.toString());

	// Serialize the modified document back to a string.
	const serializer = new XMLSerializer();
	const newSvgString = serializer.serializeToString(doc);

	return {
		svg: newSvgString,
		left: leftShift,
		top: topShift,
		right: rightShift,
		bottom: bottomShift,
	};
}
