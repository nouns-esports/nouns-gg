import { createHash } from "crypto";

export function generateTraitsFromSeed(
	seed: string,
	counts: {
		accessoryCount: number;
		bodyCount: number;
		headCount: number;
		glassesCount: number;
		backgroundCount: number;
	},
) {
	const hash = createHash("sha256").update(seed).digest("hex");

	function hexToFraction(hexSegment: string) {
		return parseInt(hexSegment, 16) / 0xffffffff;
	}

	return {
		accessory: Math.floor(
			hexToFraction(hash.slice(0, 8)) * counts.accessoryCount,
		),
		body: Math.floor(hexToFraction(hash.slice(8, 16)) * counts.bodyCount),
		head: Math.floor(hexToFraction(hash.slice(16, 24)) * counts.headCount),
		glasses: Math.floor(
			hexToFraction(hash.slice(24, 32)) * counts.glassesCount,
		),
		background: Math.floor(
			hexToFraction(hash.slice(32, 40)) * counts.backgroundCount,
		),
	};
}
