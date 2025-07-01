import { useAppStore } from "@hooks/useAppStore";
import { ParsedEmoji } from "@/utils/emojiParser";

interface Props {
	emoji: ParsedEmoji;
	size?: number;
}

function EmojiRenderer({ emoji, size = 22 }: Props) {
	const app = useAppStore();

	if (emoji.type === "custom" && emoji.id) {
		// Find the custom emoji by ID
		const customEmoji = app.emojis.get(emoji.id);
		if (customEmoji) {
			return (
				<img
					src={customEmoji.imageUrl}
					alt={`:${emoji.name}:`}
					title={`:${emoji.name}:`}
					style={{
						width: size,
						height: size,
						display: "inline-block",
						verticalAlign: "middle",
						objectFit: "contain",
					}}
				/>
			);
		}
	}

	// Fallback to text
	return <span>:{emoji.name}:</span>;
}

export default EmojiRenderer;
