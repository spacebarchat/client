import Channel from "../../stores/objects/Channel";

import { debounce } from "@mui/material";
import { ChannelType } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import Guild from "../../stores/objects/Guild";
import MessageTextArea from "./MessageTextArea";
import AttachmentUploadList from "./attachments/AttachmentUploadPreview";
import FileUpload from "./attachments/FileUpload";

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

export enum UploadStateType {
	NONE,
	ATTACHED,
	UPLOADING,
	SENDING,
}

export interface UploadState {
	type: UploadStateType;
	files: File[];
}

interface Props {
	channel: Channel;
	guild?: Guild;
}

/**
 * Component for sending messages
 */
function MessageInput({ channel }: Props) {
	const logger = useLogger("MessageInput");
	const [content, setContent] = React.useState("");
	const [uploadState, setUploadState] = React.useState<UploadState>({
		type: UploadStateType.NONE,
		files: [],
	});
	const [typing, setTyping] = React.useState<number | null>(null);

	/**
	 * Starts typing for client user and triggers gateway event
	 */
	const startTyping = React.useCallback(() => {
		if (typing && typing > Date.now()) return;
		logger.debug("ShouldStartTyping");
		// TODO: send typing request
		setTyping(+Date.now() + 10000);
	}, [typing, setTyping]);

	/**
	 * Stops typing for client user
	 */
	const stopTyping = React.useCallback(() => {
		if (typing) {
			logger.debug("ShouldStopTyping");
			setTyping(null);
		}
	}, [typing, setTyping]);

	/**
	 * Debounced version of stopTyping
	 */
	const debouncedStopTyping = React.useCallback(debounce(stopTyping, 10000), [stopTyping]);

	/**
	 * @returns Whether or not a message can be sent given the current state
	 */
	const canSendMessage = () =>
		React.useCallback(() => {
			if (!uploadState.files.length && (!content || !content.trim() || !content.replace(/\r?\n|\r/g, ""))) {
				return false;
			}

			return true;
		}, [uploadState, content]);

	const send = React.useCallback(() => {
		if (!canSendMessage()) return;
		logger.debug("ShouldSendMessage");
	}, [content, uploadState, channel, canSendMessage]);

	/**
	 * Handles the change event of the textarea
	 */
	const onChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setContent(e.target.value);
	}, []);

	const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// TODO:
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}, []);

	return (
		<Container>
			<InnerWrapper>
				<AttachmentUploadList
					state={uploadState}
					remove={(index) => {
						if (uploadState.type !== UploadStateType.ATTACHED) return;
						if (uploadState.files.length === 1) setUploadState({ type: UploadStateType.NONE, files: [] });
						else
							setUploadState({
								type: UploadStateType.ATTACHED,
								files: uploadState.files.filter((_, i) => i !== index),
							});
					}}
				/>

				<InnerInnerWrapper>
					<UploadWrapper>
						{channel.hasPermission("ATTACH_FILES") && channel.hasPermission("SEND_MESSAGES") && (
							<FileUpload
								append={(files) => {
									if (files.length === 0) return;
									if (uploadState.type === UploadStateType.NONE)
										setUploadState({ type: UploadStateType.ATTACHED, files });
									else if (uploadState.type === UploadStateType.ATTACHED)
										setUploadState({
											type: UploadStateType.ATTACHED,
											files: [...uploadState.files, ...files],
										});
								}}
							/>
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
						disabled={
							!channel.hasPermission("SEND_MESSAGES") ||
							uploadState.type === UploadStateType.UPLOADING ||
							uploadState.type === UploadStateType.SENDING
						}
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
