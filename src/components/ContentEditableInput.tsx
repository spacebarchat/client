import React, { useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useAppStore } from "@hooks/useAppStore";
import useLogger from "@/hooks/useLogger";

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

	&:empty:before {
		content: attr(data-placeholder);
		color: var(--text-disabled);
		pointer-events: none;
		font-size: 0.875rem;
	}

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
	const logger = useLogger("ContentEditableInput");
	const app = useAppStore();
	const lastValueRef = useRef(value);

	const convertTextToHtml = useCallback(
		(text: string): string => {
			const emojiRegex = /:(\w+):/g;
			let html = text;

			html = html.replace(emojiRegex, (match, emojiName) => {
				// First check custom emojis
				const customEmoji = Array.from(app.emojis.all.values()).find((emoji) => emoji.name === emojiName);

				if (customEmoji) {
					return `<img class="emoji" src="${customEmoji.imageUrl}" alt="${emojiName}" title="${emojiName}" data-emoji-name="${emojiName}" data-emoji-id="${customEmoji.id}" />`;
				}

				return match;
			});

			// Escape other HTML and preserve line breaks
			html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

			return html;
		},
		[app.emojis],
	);

	const convertHtmlToText = useCallback((html: string): string => {
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = html;

		// Replace emoji images with text syntax
		const emojiImages = tempDiv.querySelectorAll("img.emoji");
		emojiImages.forEach((img) => {
			const emojiName = img.getAttribute("data-emoji-name");
			if (emojiName) {
				const textNode = document.createTextNode(`:${emojiName}:`);
				img.parentNode?.replaceChild(textNode, img);
			}
		});

		// Convert <br> back to newlines and get text content
		tempDiv.innerHTML = tempDiv.innerHTML.replace(/<br>/g, "\n");
		return tempDiv.textContent || "";
	}, []);

	useEffect(() => {
		if (!divRef.current) return;

		const currentText = convertHtmlToText(divRef.current.innerHTML);
		if (currentText !== value) {
			const html = convertTextToHtml(value);
			divRef.current.innerHTML = html;
			lastValueRef.current = value;
		}
	}, [value, convertTextToHtml, convertHtmlToText]);

	const handleInput = useCallback(() => {
		if (!divRef.current) return;

		const selection = window.getSelection();
		let savedRange = null;
		let cursorOffset = 0;

		// Save current cursor position before any changes
		if (selection && selection.rangeCount > 0) {
			savedRange = selection.getRangeAt(0).cloneRange();
			// Calculate how far we are from the start
			const tempRange = document.createRange();
			tempRange.selectNodeContents(divRef.current);
			tempRange.setEnd(savedRange.startContainer, savedRange.startOffset);
			cursorOffset = tempRange.toString().length;
		}

		const currentHtml = divRef.current.innerHTML;
		const plainText = convertHtmlToText(currentHtml);

		// Check if we need to process emoji replacements
		const emojiRegex = /:(\w+):/g;
		let hasChanges = false;
		let newHtml = currentHtml;
		let offsetAdjustment = 0; // Track how much we've changed the content length

		// Find recently typed emoji patterns and replace them
		const matches = Array.from(plainText.matchAll(emojiRegex));

		for (const match of matches) {
			const emojiName = match[1];
			const customEmoji = Array.from(app.emojis.all.values()).find((emoji) => emoji.name === emojiName);

			if (customEmoji) {
				const existingImages = divRef.current.querySelectorAll(`img[data-emoji-name="${emojiName}"]`);
				const textMatches = (plainText.match(new RegExp(`:${emojiName}:`, "g")) || []).length;

				if (textMatches > existingImages.length) {
					const emojiHtml = `<img class="emoji" src="${customEmoji.imageUrl}" alt="${emojiName}" title="${emojiName}" data-emoji-name="${emojiName}" data-emoji-id="${customEmoji.id}" />`;
					const originalText = `:${emojiName}:`;

					if (match.index !== undefined && match.index === cursorOffset - originalText.length) {
						// Special case: we just typed this emoji (cursor is right after it)
						// Don't adjust offset, just position cursor after the new image
						newHtml = newHtml.replace(originalText, emojiHtml);
						hasChanges = true;

						// Set a flag to position cursor after this specific emoji
						setTimeout(() => {
							const newImages = divRef.current?.querySelectorAll(`img[data-emoji-name="${emojiName}"]`);
							if (newImages && newImages.length > 0) {
								const lastImage = newImages[newImages.length - 1];
								const range = document.createRange();
								range.setStartAfter(lastImage);
								range.collapse(true);
								const sel = window.getSelection();
								sel?.removeAllRanges();
								sel?.addRange(range);
							}
						}, 0);
						continue;
					} else if (match.index !== undefined && match.index < cursorOffset) {
						// This replacement affects our cursor position
						const lengthDifference = emojiHtml.length - originalText.length;
						offsetAdjustment += lengthDifference;
					}

					newHtml = newHtml.replace(originalText, emojiHtml);
					hasChanges = true;
				}
			}
		}

		if (hasChanges) {
			divRef.current.innerHTML = newHtml;

			// Only do complex cursor positioning if we're not handling a just-typed emoji
			if (offsetAdjustment !== 0) {
				// Restore cursor position with adjustment
				try {
					const adjustedOffset = cursorOffset + offsetAdjustment;

					const newPlainText = convertHtmlToText(divRef.current.innerHTML);
					const targetPosition = Math.min(adjustedOffset, newPlainText.length);

					// Walk through the DOM to find the position
					let currentPos = 0;
					let targetNode = null;
					let targetOffset = 0;

					const walker = document.createTreeWalker(divRef.current, NodeFilter.SHOW_TEXT, null);

					let node;
					while ((node = walker.nextNode())) {
						const nodeLength = node.textContent?.length || 0;
						if (currentPos + nodeLength >= targetPosition) {
							targetNode = node;
							targetOffset = targetPosition - currentPos;
							break;
						}
						currentPos += nodeLength;
					}

					if (targetNode) {
						const newRange = document.createRange();
						newRange.setStart(targetNode, targetOffset);
						newRange.collapse(true);
						selection?.removeAllRanges();
						selection?.addRange(newRange);
					} else {
						// Fallback: position at end
						const newRange = document.createRange();
						newRange.selectNodeContents(divRef.current);
						newRange.collapse(false);
						selection?.removeAllRanges();
						selection?.addRange(newRange);
					}
				} catch (e) {
					divRef.current.focus();
				}
			}
		}

		const finalText = convertHtmlToText(divRef.current.innerHTML);

		if (finalText !== lastValueRef.current) {
			lastValueRef.current = finalText;
			onChange(finalText);
		}
	}, [convertHtmlToText, app.emojis, onChange]);

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
