import { modalController } from "@/controllers/modals";
import { useAppStore } from "@hooks/useAppStore";
import useLogger from "@hooks/useLogger";
import { EmojiClickData } from "@spacebarchat/emoji-picker-react";
import { ChannelType, MessageType, RESTPostAPIChannelMessageJSONBody } from "@spacebarchat/spacebar-api-types/v9";
import Channel from "@structures/Channel";
import Guild from "@structures/Guild";
import { MAX_ATTACHMENTS, Snowflake } from "@utils";
import debounce from "@utils/debounce";
import { observer } from "mobx-react-lite";
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import Icon from "../Icon";
import IconButton from "../IconButton";
import AttachmentUpload from "./attachments/AttachmentUpload";
import AttachmentUploadList from "./attachments/AttachmentUploadPreview";
import MessagePickerPopup from "./MessagePickerPopup";
import MessageTextArea from "./MessageTextArea";

const Container = styled.div`
	padding: 0 16px;
	margin-bottom: 25px;
`;

const InnerWrapper = styled.div`
	background-color: var(--background-primary);
	padding: 0 16px;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
`;

const InnerInnerWrapper = styled.div`
	display: flex;
	flex-direction: row;
`;

const UploadWrapper = styled.div`
	flex: 0 0 auto;
	position: sticky;
`;

const ButtonWrapper = styled.div`
	height: 45px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

interface Props {
	channel: Channel;
	guild?: Guild;
}

/**
 * Component for sending messages
 */
function MessageInput({ channel }: Props) {
	const app = useAppStore();
	const logger = useLogger("MessageInput");
	const [content, setContent] = useState("");
	const [attachments, setAttachments] = useState<File[]>([]);
	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
	const emoteButtonRef = useRef<HTMLButtonElement>(null);
	const [savedSelection, setSavedSelection] = useState<{
		startContainer: Node;
		startOffset: number;
		endContainer: Node;
		endOffset: number;
	} | null>(null);

	/**
	 * Debounced stopTyping
	 */
	const debouncedStopTyping = useCallback(
		debounce(() => channel.stopTyping(), 10_000),
		[channel],
	);

	/**
	 * @returns Whether or not a message can be sent given the current state
	 */
	const canSendMessage = useCallback(() => {
		if (!attachments.length && (!content || !content.trim() || !content.replace(/\r?\n|\r/g, ""))) {
			return false;
		}

		return true;
	}, [attachments, content]);

	const convertCustomEmojisForSending = useCallback(
		(text: string): string => {
			const emojiRegex = /:(\w+):/g;

			return text.replace(emojiRegex, (match, emojiName) => {
				const customEmoji = Array.from(app.emojis.all.values()).find((emoji) => emoji.name === emojiName);

				if (customEmoji) {
					return `<:${emojiName}:${customEmoji.id}>`;
				}

				// TODO: Replace with Twemoji for consistency
				return match;
			});
		},
		[app.emojis],
	);

	const sendMessage = useCallback(async () => {
		channel.stopTyping();
		const shouldFail = app.experiments.isTreatmentEnabled("message_queue", 2);
		const shouldSend = !app.experiments.isTreatmentEnabled("message_queue", 1);

		if (!canSendMessage() && !shouldFail) return;

		const contentForSending = convertCustomEmojisForSending(content);
		const contentCopy = contentForSending;
		const attachmentsCopy = attachments;

		setContent("");
		setAttachments([]);
		// stop typing
		debouncedStopTyping(true);

		const nonce = Snowflake.generate();
		const msg = app.queue.add({
			id: nonce,
			content: contentCopy,
			files: attachmentsCopy,
			author: app.account!.raw,
			channel_id: channel.id,
			guild_id: channel.guildId,
			timestamp: new Date().toISOString(),
			type: MessageType.Default,
		});

		if (shouldSend) {
			try {
				let body: RESTPostAPIChannelMessageJSONBody | FormData;
				if (attachmentsCopy.length > 0) {
					const data = new FormData();
					data.append("payload_json", JSON.stringify({ content: contentForSending, nonce }));
					attachmentsCopy.forEach((file, index) => {
						data.append(`files[${index}]`, file);
					});
					body = data;
				} else {
					body = { content: contentForSending, nonce };
				}
				await channel.sendMessage(body, msg);
			} catch (e) {
				const error = e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";
				msg.fail(error);
			}
		} else if (shouldFail) {
			msg.fail("Message queue experiment");
		}
	}, [content, attachments, channel, canSendMessage]);

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.ctrlKey && e.key === "Enter") {
			e.preventDefault();
			sendMessage();
		}

		// TODO: handle editing last message

		if (!e.shiftKey && e.key === "Enter") {
			e.preventDefault();
			sendMessage();
		}

		if (e.key === "Escape") {
			if (attachments.length > 0) {
				setAttachments([]);
			}
		}

		debouncedStopTyping(true);
	};

	const onChange = (value: string) => {
		setContent(value);
		channel.startTyping();
	};

	const appendAttachment = (files: File[]) => {
		if (files.length === 0) return;
		if (files.length > MAX_ATTACHMENTS || attachments.length + files.length > MAX_ATTACHMENTS) {
			modalController.push({
				type: "error",
				title: "Too many attachments",
				error: `You can only attach ${MAX_ATTACHMENTS} files at once.`,
			});
			return;
		}
		setAttachments((prev) => [...prev, ...files]);
	};

	const clearInput = () => {
		setContent("");
	};

	const onEmojiButtonClick = () => {
		const textArea = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
		if (textArea) {
			textArea.focus();
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				setSavedSelection({
					startContainer: range.startContainer,
					startOffset: range.startOffset,
					endContainer: range.endContainer,
					endOffset: range.endOffset,
				});
			}
		}

		setIsEmojiPickerOpen((prev) => !prev);
	};

	const onEmojiSelect = (e: EmojiClickData) => {
		if (!e) return;

		const textArea = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
		if (!textArea) return;

		if (e.isCustom && e.imageUrl) {
			// For custom emojis, find the emoji data and insert HTML directly
			const customEmoji = Array.from(app.emojis.all.values()).find((emoji) => emoji.name === e.names[0]);

			if (customEmoji) {
				const emojiImg = document.createElement("img");
				emojiImg.className = "emoji";
				emojiImg.src = customEmoji.imageUrl;
				emojiImg.alt = customEmoji.name;
				emojiImg.title = customEmoji.name;
				emojiImg.setAttribute("data-emoji-name", customEmoji.name);
				emojiImg.setAttribute("data-emoji-id", customEmoji.id);

				insertElementAtCursor(textArea, emojiImg);
			}
		} else {
			// For unicode emojis, insert as text
			// TODO: Map to Twemoji for consistency
			insertTextAtCursor(textArea, e.emoji);
		}

		const newContent = convertHtmlToText(textArea.innerHTML);
		setContent(newContent);

		setIsEmojiPickerOpen(false);
		channel.startTyping();
	};

	const insertElementAtCursor = (element: HTMLDivElement, nodeToInsert: Node) => {
		element.focus();

		const selection = window.getSelection();

		// Try to restore saved cursor position first
		if (savedSelection && selection) {
			try {
				const range = document.createRange();
				range.setStart(savedSelection.startContainer, savedSelection.startOffset);
				range.setEnd(savedSelection.endContainer, savedSelection.endOffset);
				selection.removeAllRanges();
				selection.addRange(range);
			} catch (e) {
				// Fallback
				logger.warn("Failed to restore saved selection:", e);

				const range = document.createRange();
				range.selectNodeContents(element);
				range.collapse(false);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}

		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			range.deleteContents();
			range.insertNode(nodeToInsert);

			// Position cursor after the inserted element
			range.setStartAfter(nodeToInsert);
			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);

			setSavedSelection(null);
			return true;
		}

		return false;
	};

	const insertTextAtCursor = (element: HTMLDivElement, text: string) => {
		element.focus();

		const selection = window.getSelection();

		if (savedSelection && selection) {
			try {
				const range = document.createRange();
				range.setStart(savedSelection.startContainer, savedSelection.startOffset);
				range.setEnd(savedSelection.endContainer, savedSelection.endOffset);
				selection.removeAllRanges();
				selection.addRange(range);
			} catch (e) {
				logger.warn("Failed to restore saved selection:", e);
				const range = document.createRange();
				range.selectNodeContents(element);
				range.collapse(false);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}

		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			range.deleteContents();
			const textNode = document.createTextNode(text);
			range.insertNode(textNode);
			range.collapse(false);
			selection.removeAllRanges();
			selection.addRange(range);

			setSavedSelection(null);
			return true;
		}

		return false;
	};

	const convertHtmlToText = (html: string): string => {
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
	};

	return (
		<Container>
			<InnerWrapper>
				<AttachmentUploadList
					attachments={attachments}
					remove={(index) => {
						if (attachments.length === 0) return;
						if (attachments.length === 1) setAttachments([]);
						else setAttachments(attachments.filter((_, i) => i !== index));
					}}
				/>

				<InnerInnerWrapper>
					<UploadWrapper>
						{channel.hasPermission("ATTACH_FILES") && channel.hasPermission("SEND_MESSAGES") && (
							<AttachmentUpload append={appendAttachment} clearInput={clearInput} />
						)}
					</UploadWrapper>
					<MessageTextArea
						id="messageinput"
						// maxLength={4000} // TODO: this should come from the server
						value={content}
						placeholder={
							channel.hasPermission("SEND_MESSAGES")
								? `Message ${
										channel.type === ChannelType.DM
											? channel.recipients?.[0].username
											: "#" + channel.name
								  }`
								: "You do not have permission to send messages in this channel."
						}
						disabled={!channel.hasPermission("SEND_MESSAGES")}
						onChange={onChange}
						onKeyDown={onKeyDown}
					/>

					{channel.hasPermission("SEND_MESSAGES") && (
						<>
							<ButtonWrapper>
								<IconButton ref={emoteButtonRef} onClick={onEmojiButtonClick}>
									<Icon icon="mdiStickerEmoji" size="24px" color="var(--text)" />
								</IconButton>
							</ButtonWrapper>
							{/* Emoji picker popup */}
							<MessagePickerPopup
								isOpen={isEmojiPickerOpen}
								onClose={() => setIsEmojiPickerOpen(false)}
								buttonRef={emoteButtonRef}
								onEmojiSelect={onEmojiSelect}
							/>
						</>
					)}
				</InnerInnerWrapper>
			</InnerWrapper>
		</Container>
	);
}

export default observer(MessageInput);
