import { DOMParser, XMLSerializer } from "xmldom";

export function padSVG(
	svgString: string,
	padding: { left: number; top: number; right: number; bottom: number },
): string {
	// Parse the SVG string into an XML document.
	const parser = new DOMParser();
	const doc = parser.parseFromString(svgString, "application/xml");
	const svg = doc.getElementsByTagName("svg")[0];
	if (!svg) {
		throw new Error("Invalid SVG string");
	}

	// Get all descendant elements with x, y, width, and height attributes.
	const allElements = svg.getElementsByTagName("*");
	const elements: Element[] = [];
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	// Compute the bounding box of the content.
	for (let i = 0; i < allElements.length; i++) {
		const el = allElements[i];
		if (
			el.hasAttribute("x") &&
			el.hasAttribute("y") &&
			el.hasAttribute("width") &&
			el.hasAttribute("height")
		) {
			elements.push(el);
			const x = parseFloat(el.getAttribute("x") || "0");
			const y = parseFloat(el.getAttribute("y") || "0");
			const width = parseFloat(el.getAttribute("width") || "0");
			const height = parseFloat(el.getAttribute("height") || "0");
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x + width > maxX) maxX = x + width;
			if (y + height > maxY) maxY = y + height;
		}
	}

	// We want to rebase the content so that its top‐left becomes equal to the left/top padding.
	// If the SVG is already trimmed (minX/minY are 0) then this simply adds the padding.
	const shiftX = padding.left - minX;
	const shiftY = padding.top - minY;

	// Shift each element’s x and y attributes.
	for (const el of elements) {
		const x = parseFloat(el.getAttribute("x") || "0");
		const y = parseFloat(el.getAttribute("y") || "0");
		el.setAttribute("x", (x + shiftX).toString());
		el.setAttribute("y", (y + shiftY).toString());
	}

	// After shifting, the content’s new bounding box starts at (padding.left, padding.top).
	const contentWidth = maxX - minX;
	const contentHeight = maxY - minY;

	// The new overall SVG dimensions include extra whitespace on all sides.
	const newWidth = contentWidth + padding.left + padding.right;
	const newHeight = contentHeight + padding.top + padding.bottom;

	// Update the SVG's viewBox and dimensions.
	svg.setAttribute("viewBox", `0 0 ${newWidth} ${newHeight}`);
	svg.setAttribute("width", newWidth.toString());
	svg.setAttribute("height", newHeight.toString());

	// Serialize the modified document back to a string.
	const serializer = new XMLSerializer();
	const newSvgString = serializer.serializeToString(doc);

	return newSvgString;
}
