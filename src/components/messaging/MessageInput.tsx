import Channel from "@structures/Channel";

import { ChannelType, MessageType, RESTPostAPIChannelMessageJSONBody } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

import { modalController } from "@/controllers/modals";
import { useAppStore } from "@hooks/useAppStore";
import useLogger from "@hooks/useLogger";
import Guild from "@structures/Guild";
import { MAX_ATTACHMENTS, Snowflake } from "@utils";
import debounce from "@utils/debounce";
import MessageTextArea from "./MessageTextArea";
import AttachmentUpload from "./attachments/AttachmentUpload";
import AttachmentUploadList from "./attachments/AttachmentUploadPreview";

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
	const [content, setContent] = React.useState("");
	const [attachments, setAttachments] = React.useState<File[]>([]);

	/**
	 * Debounced stopTyping
	 */
	const debouncedStopTyping = React.useCallback(
		debounce(() => channel.stopTyping(), 10_000),
		[channel],
	);

	/**
	 * @returns Whether or not a message can be sent given the current state
	 */
	const canSendMessage = React.useCallback(() => {
		if (!attachments.length && (!content || !content.trim() || !content.replace(/\r?\n|\r/g, ""))) {
			return false;
		}

		return true;
	}, [attachments, content]);

	const sendMessage = React.useCallback(async () => {
		channel.stopTyping();
		const shouldFail = app.experiments.isTreatmentEnabled("message_queue", 2);
		const shouldSend = !app.experiments.isTreatmentEnabled("message_queue", 1);

		if (!canSendMessage() && !shouldFail) return;

		const contentCopy = content;
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
					data.append("payload_json", JSON.stringify({ content, nonce }));
					attachmentsCopy.forEach((file, index) => {
						data.append(`files[${index}]`, file);
					});
					body = data;
				} else {
					body = { content, nonce };
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

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.ctrlKey && e.key === "Enter") {
			e.preventDefault();
			return sendMessage();
		}

		// TODO: handle editing last message

		if (!e.shiftKey && e.key === "Enter") {
			e.preventDefault();
			return sendMessage();
		}

		if (e.key === "Escape") {
			if (attachments.length > 0) {
				setAttachments([]);
			}
		}

		debouncedStopTyping(true);
	};

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setContent(e.target.value);
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
							<AttachmentUpload append={appendAttachment} clearInput={clearInput}/>
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
					<ButtonWrapper>
						{/* <IconButton>
						<Icon icon="mdiStickerEmoji" size="24px" color="var(--text)" />
					</IconButton> */}
					</ButtonWrapper>
				</InnerInnerWrapper>
			</InnerWrapper>
		</Container>
	);
}

export default observer(MessageInput);
