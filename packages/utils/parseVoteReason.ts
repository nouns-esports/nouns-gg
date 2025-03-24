export type Reason = {
	text: string;
	reposts: Reason[];
};

export function parseVoteReason(reason: string) {
	// Regex to match repost sections:
	// A line that is exactly "+1", followed by two newlines,
	// then one or more lines starting with '>' (the quoted text).
	const REPOST_REGEX = /^\+1$(\n){2}(?<quote>(?:^>.*?$\s*)+)/gms;

	if (!reason || reason.trim() === "") {
		return { text: "", reposts: [] };
	}

	const reposts: Reason[] = [];
	let remainingText: string = reason;

	// Process all matches of repost sections.
	const matches = [...remainingText.matchAll(REPOST_REGEX)];
	for (const match of matches) {
		if (!match.groups || !match.groups.quote) continue;
		const fullMatch = match[0];
		const quotedBlock = match.groups.quote;

		// Inline unquote: remove the leading "> " (or ">") from each line.
		const unquoted = quotedBlock
			.split("\n")
			.map((line) => line.replace(/^>\s?/, ""))
			.join("\n")
			.trim();

		// Recursively parse the unquoted text for nested reposts.
		const parsedRepost = parseVoteReason(unquoted);
		reposts.push(parsedRepost);

		// Remove this repost section from the remaining text.
		remainingText = remainingText.replace(fullMatch, "");
	}

	return { text: remainingText.trim(), reposts };
}
