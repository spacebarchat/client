import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const EmojiPopup = styled.div`
	position: absolute;
	bottom: 52px;
	right: 0;
	z-index: 1;
`;

interface Props {
	onEmojiSelect: (emoji: EmojiClickData) => void;
}

function EmojiPicker({ onEmojiSelect }: Props) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

	const onEmojiSelect = (e: EmojiClickData) => {
		if (!e) return;
		const emoji = e.emoji;
		setContent((prev) => prev + emoji);
		document.getElementById("messageinput")?.focus();
		setIsEmojiPickerOpen(false);
		channel.startTyping();
	};

	useEffect(() => {
		const handleResize = () => {
			if (isEmojiPickerOpen && buttonRef.current) {
				setButtonRect(buttonRef.current.getBoundingClientRect());
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [isEmojiPickerOpen]);

	return createPortal(
		<EmojiPopup
			style={{
				position: "fixed",
				bottom: window.innerHeight - buttonRect.top + 8,
				right: window.innerWidth - buttonRect.right,
			}}
		>
			<EmojiPicker
				theme={Theme.DARK}
				emojiStyle={EmojiStyle.TWITTER}
				lazyLoadEmojis={true}
				onEmojiClick={(e) => {
					onEmojiSelect(e);
				}}
			/>
		</EmojiPopup>,
		document.body,
	);
}

export default EmojiPicker;
