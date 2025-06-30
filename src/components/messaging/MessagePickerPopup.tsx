import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const PopupContainer = styled.div`
	position: absolute;
	bottom: 52px;
	right: 0;
	z-index: 1;
`;

const ClickTrap = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;

interface Props {
	isOpen: boolean;
	onClose: () => void;
	buttonRef: React.RefObject<HTMLButtonElement>;
	onEmojiSelect: (emoji: EmojiClickData) => void;
}

function MessagePickerPopup({ isOpen, onClose, buttonRef, onEmojiSelect }: Props) {
	const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

	useEffect(() => {
		const handleResize = () => {
			if (isOpen && buttonRef.current) {
				setButtonRect(buttonRef.current.getBoundingClientRect());
			}
		};

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [isOpen]);

	return (
		isOpen &&
		buttonRect &&
		createPortal(
			<ClickTrap onClick={onClose}>
				<PopupContainer
					onClick={(e) => {
						e.stopPropagation();
					}}
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
				</PopupContainer>
			</ClickTrap>,
			document.body,
		)
	);
}

export default MessagePickerPopup;
