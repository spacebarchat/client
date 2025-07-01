export interface ParsedEmoji {
	type: "unicode" | "custom";
	id: string;
	name: string;
	animated?: boolean;
	unified?: string;
}

export function parseEmojiString(content: string): (string | ParsedEmoji)[] {
	// Discord-style emoji regex: <:name:id> or <a:name:id>
	const emojiRegex = /<(a?):(\w+):(\d+)>/g;
	const parts: (string | ParsedEmoji)[] = [];
	let lastIndex = 0;
	let match;

	while ((match = emojiRegex.exec(content)) !== null) {
		// Add text before emoji
		if (match.index > lastIndex) {
			parts.push(content.slice(lastIndex, match.index));
		}

		parts.push({
			type: "custom",
			animated: match[1] === "a",
			name: match[2],
			id: match[3],
		});

		lastIndex = match.index + match[0].length;
	}

	// Add remaining text
	if (lastIndex < content.length) {
		parts.push(content.slice(lastIndex));
	}

	return parts;
}
