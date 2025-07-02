import { useAppStore } from "@/hooks/useAppStore";
import { REST } from "@/utils";
import { CDNRoutes, ImageFormat } from "@spacebarchat/spacebar-api-types/v9";
import EmojiPicker, { baseCategoriesConfig, EmojiClickData, EmojiStyle, Theme } from "@spacebarchat/emoji-picker-react";
import React, { useEffect, useMemo, useState } from "react";
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
	const { guilds, emojis } = useAppStore();

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

	const { customEmojis, categories } = useMemo(() => {
		const customEmojis: any[] = [];
		const categories: any[] = [];

		// Process each guild's emojis
		guilds.all.forEach((guild) => {
			const guildEmojis = guild.emojis;

			if (guildEmojis.length > 0) {
				guildEmojis.forEach((emoji) => {
					customEmojis.push({
						names: [emoji.name],
						imgUrl: emoji.imageUrl,
						id: emoji.id,
						categoryId: guild.id,
					});
				});

				categories.push({
					name: guild.name,
					category: `custom_${guild.id}`,
					imageUrl: guild.icon
						? REST.makeCDNUrl(CDNRoutes.guildIcon(guild.id, guild.icon, ImageFormat.PNG))
						: null,
					acronym: guild.acronym,
				});
			}
		});

		// Add default categories
		categories.push(...baseCategoriesConfig());

		return { customEmojis, categories };
	}, [emojis.all, guilds.all]);

	return (
		isOpen &&
		buttonRect &&
		createPortal(
			<ClickTrap onClick={onClose}>
				<PopupContainer
					onClick={(e) => e.stopPropagation()}
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
						customEmojis={customEmojis}
						categories={categories}
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
