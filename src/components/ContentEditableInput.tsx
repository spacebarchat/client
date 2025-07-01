import React, { useRef, useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { useAppStore } from "@hooks/useAppStore";

const ContentEditableDiv = styled.div`
	resize: none;
	border: none;
	outline: none;
	background-color: transparent;
	color: var(--text);
	overflow-wrap: break-word;
	word-break: break-word;
	white-space: break-spaces;
	font-size: 16px;
	font-family: var(--font-family);
	flex: 1;
	padding: 13px 10px;
	min-height: 20px;
	max-height: 50vh;
	overflow-y: auto;

	&:disabled {
		cursor: not-allowed;
		color: var(--text-disabled);
	}

	img.emoji {
		width: 22px;
		height: 22px;
		vertical-align: middle;
		margin: 0 1px;
	}

	&:empty:before {
		content: attr(data-placeholder);
		color: var(--text-disabled);
		pointer-events: none;
		font-size: 0.875rem;
	}
`;

interface Props {
	id: string;
	value: string;
	onChange: (value: string) => void;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	placeholder?: string;
	disabled?: boolean;
	maxLength?: number;
}

export function ContentEditableInput({
	id,
	value,
	onChange,
	onKeyDown,
	placeholder = "",
	disabled = false,
	maxLength,
}: Props) {
	const divRef = useRef<HTMLDivElement>(null);
	const app = useAppStore();
	const [isTypingEmoji, setIsTypingEmoji] = useState(false);
	const [emojiStartPos, setEmojiStartPos] = useState<number>(-1);

	const convertHtmlToText = useCallback((html: string): string => {
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = html;

		const emojiImages = tempDiv.querySelectorAll("img.emoji");
		emojiImages.forEach((img) => {
			const emojiName = img.getAttribute("data-emoji-name");
			if (emojiName) {
				const textNode = document.createTextNode(`:${emojiName}:`);
				img.parentNode?.replaceChild(textNode, img);
			}
		});

		tempDiv.innerHTML = tempDiv.innerHTML.replace(/<br>/g, "\n");
		return tempDiv.textContent || "";
	}, []);

	const convertTextToHtml = useCallback(
		(text: string): string => {
			const emojiRegex = /:(\w+):/g;
			let html = text;

			html = html.replace(emojiRegex, (match, emojiName) => {
				const customEmoji = Array.from(app.emojis.all.values()).find((emoji) => emoji.name === emojiName);

				if (customEmoji) {
					return `<img class="emoji" src="${customEmoji.imageUrl}" alt="${emojiName}" title="${emojiName}" data-emoji-name="${emojiName}" data-emoji-id="${customEmoji.id}" />`;
				}

				return match;
			});

			html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

			return html;
		},
		[app.emojis],
	);

	useEffect(() => {
		if (!divRef.current) return;

		const currentText = convertHtmlToText(divRef.current.innerHTML);
		if (currentText !== value) {
			const html = convertTextToHtml(value);
			divRef.current.innerHTML = html;
		}
	}, [value, convertTextToHtml, convertHtmlToText]);

	const insertEmojiImage = useCallback(
		(emojiName: string) => {
			if (!divRef.current) return;

			const customEmoji = Array.from(app.emojis.all.values()).find((emoji) => emoji.name === emojiName);
			if (!customEmoji) return;

			const selection = window.getSelection();
			if (!selection || selection.rangeCount === 0) return;

			const range = selection.getRangeAt(0);

			const emojiImg = document.createElement("img");
			emojiImg.className = "emoji";
			emojiImg.src = customEmoji.imageUrl;
			emojiImg.alt = emojiName;
			emojiImg.title = emojiName;
			emojiImg.setAttribute("data-emoji-name", emojiName);
			emojiImg.setAttribute("data-emoji-id", customEmoji.id);

			range.deleteContents();
			range.insertNode(emojiImg);

			range.setStartAfter(emojiImg);
			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);

			const newText = convertHtmlToText(divRef.current.innerHTML);
			onChange(newText);
		},
		[app.emojis, onChange, convertHtmlToText],
	);

	const handleInput = useCallback(
		(e: React.FormEvent<HTMLDivElement>) => {
			if (!divRef.current) return;

			const inputEvent = e.nativeEvent as InputEvent;
			const inputType = inputEvent.inputType;

			if (inputType === "insertText" || inputType === "insertCompositionText") {
				const data = inputEvent.data;

				if (data === ":") {
					if (!isTypingEmoji) {
						setIsTypingEmoji(true);
						const selection = window.getSelection();
						if (selection && selection.rangeCount > 0) {
							const range = selection.getRangeAt(0);
							const tempRange = document.createRange();
							tempRange.selectNodeContents(divRef.current);
							tempRange.setEnd(range.startContainer, range.startOffset);
							setEmojiStartPos(tempRange.toString().length - 1);
						}
					} else {
						if (emojiStartPos >= 0) {
							const currentText = convertHtmlToText(divRef.current.innerHTML);
							const emojiText = currentText.substring(emojiStartPos);
							const match = emojiText.match(/^:(\w+):$/);

							if (match) {
								const emojiName = match[1];
								const customEmoji = Array.from(app.emojis.all.values()).find(
									(emoji) => emoji.name === emojiName,
								);

								if (customEmoji) {
									const selection = window.getSelection();
									if (selection && selection.rangeCount > 0) {
										const range = selection.getRangeAt(0);

										const startRange = document.createRange();
										startRange.selectNodeContents(divRef.current);

										let currentPos = 0;
										let startNode = null;
										let startOffset = 0;

										const walker = document.createTreeWalker(divRef.current, NodeFilter.SHOW_TEXT);
										let node;
										while ((node = walker.nextNode())) {
											const nodeLength = node.textContent?.length || 0;
											if (currentPos + nodeLength > emojiStartPos) {
												startNode = node;
												startOffset = emojiStartPos - currentPos;
												break;
											}
											currentPos += nodeLength;
										}

										if (startNode) {
											range.setStart(startNode, startOffset);
											range.deleteContents();

											const emojiImg = document.createElement("img");
											emojiImg.className = "emoji";
											emojiImg.src = customEmoji.imageUrl;
											emojiImg.alt = emojiName;
											emojiImg.title = emojiName;
											emojiImg.setAttribute("data-emoji-name", emojiName);
											emojiImg.setAttribute("data-emoji-id", customEmoji.id);

											range.insertNode(emojiImg);
											range.setStartAfter(emojiImg);
											range.collapse(true);
											selection.removeAllRanges();
											selection.addRange(range);
										}
									}

									setIsTypingEmoji(false);
									setEmojiStartPos(-1);

									const newText = convertHtmlToText(divRef.current.innerHTML);
									onChange(newText);
									return;
								}
							}
						}
						setIsTypingEmoji(false);
						setEmojiStartPos(-1);
					}
				} else if (isTypingEmoji && data && !/\w/.test(data)) {
					setIsTypingEmoji(false);
					setEmojiStartPos(-1);
				}
			} else if (inputType === "deleteContentBackward" || inputType === "deleteContentForward") {
				setIsTypingEmoji(false);
				setEmojiStartPos(-1);
			}

			const currentText = convertHtmlToText(divRef.current.innerHTML);
			if (!currentText.trim()) {
				divRef.current.innerHTML = "";
			}

			onChange(currentText);
		},
		[convertHtmlToText, onChange, app.emojis, isTypingEmoji, emojiStartPos],
	);

	useEffect(() => {
		if (!divRef.current) return;

		const currentText = convertHtmlToText(divRef.current.innerHTML);
		if (!currentText.trim() && divRef.current.innerHTML !== "") {
			divRef.current.innerHTML = "";
		}
	}, [value, convertHtmlToText]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (maxLength && divRef.current) {
				const currentText = convertHtmlToText(divRef.current.innerHTML);
				if (
					currentText.length >= maxLength &&
					!["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
				) {
					e.preventDefault();
					return;
				}
			}

			onKeyDown?.(e);
		},
		[maxLength, convertHtmlToText, onKeyDown],
	);

	return (
		<ContentEditableDiv
			id={id}
			ref={divRef}
			contentEditable={!disabled}
			onInput={handleInput}
			onKeyDown={handleKeyDown}
			data-placeholder={placeholder}
			suppressContentEditableWarning={true}
		/>
	);
}

export default ContentEditableInput;
