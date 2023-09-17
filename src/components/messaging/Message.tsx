import { MessageType } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import reactStringReplace from "react-string-replace";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { MessageLike } from "../../stores/objects/Message";
import Avatar from "../Avatar";
import { Link } from "../Link";
import { IContextMenuItem } from "./../ContextMenuItem";
import MessageAttachment from "./MessageAttachment";
import MessageBase from "./MessageBase";
import MessageEmbed from "./MessageEmbed";
import MessageTimestamp from "./MessageTimestamp";
import SystemMessage from "./SystemMessage";
import AttachmentUploadProgress from "./attachments/AttachmentUploadProgress";

const MessageListItem = styled.li`
	list-style: none;
`;

const Container = styled.div<{ isHeader?: boolean }>`
	display: flex;
	flex-direction: row;
	position: relative;
	padding: 2px 12px;
	margin-top: ${(props) => (props.isHeader ? "20px" : undefined)};

	&:hover {
		background-color: var(--background-primary-highlight);
	}
`;

const MessageContentContainer = styled.div<{ isHeader?: boolean }>`
	flex: 1;
	margin-left: ${(props) => (props.isHeader ? undefined : "50px")};
`;

const MessageHeader = styled.div`
	display: flex;
	flex: 1;
	flex-direction: row;
	align-items: center;
`;

const MessageAuthor = styled.div`
	font-size: 16px;
	font-weight: var(--font-weight-medium);
`;

const MessageContent = styled.div<{ sending?: boolean; failed?: boolean }>`
	font-size: 16px;
	font-weight: var(--font-weight-light);
	white-space: pre-wrap;
	word-wrap: anywhere;
	opacity: ${(props) => (props.sending ? 0.5 : undefined)};
	color: ${(props) => (props.failed ? "var(--error)" : undefined)};
`;

const MessageHeaderWrapper = styled.div`
	display: flex;
	flex-direction: row;
`;

function parseMessageContent(content?: string | null) {
	if (!content) return null;
	// replace links with Link components
	const replacedText = reactStringReplace(content, /(https?:\/\/\S+)/g, (match, i) => (
		<Link key={match + i} href={match} target="_blank" rel="noreferrer">
			{match}
		</Link>
	));

	return replacedText;
}

interface Props {
	message: MessageLike;
	isHeader?: boolean;
	isSending?: boolean;
	isFailed?: boolean;
}

/**
 * Component for rendering a single message
 */
function Message({ message, isHeader, isSending, isFailed }: Props) {
	const contextMenu = React.useContext(ContextMenuContext);
	const [contextMenuItems, setContextMenuItems] = React.useState<IContextMenuItem[]>([
		{
			label: "Copy Message ID",
			onClick: () => {
				navigator.clipboard.writeText(message.id);
			},
			iconProps: {
				icon: "mdiIdentifier",
			},
		},
	]);

	const withMessageHeader = React.useCallback(
		(children: React.ReactNode, showHeader = false) => (
			<MessageHeaderWrapper>
				{showHeader && (
					<Avatar
						key={message.author.id}
						user={message.author}
						size={40}
						style={{
							marginRight: 10,
							backgroundColor: "transparent",
						}}
					/>
				)}

				<MessageContentContainer isHeader={showHeader}>
					{showHeader && (
						<MessageHeader>
							<MessageAuthor>{message.author.username}</MessageAuthor>
							<MessageTimestamp date={message.timestamp} />
						</MessageHeader>
					)}

					{children}

					{"files" in message && message.files?.length !== 0 && (
						<AttachmentUploadProgress message={message} />
					)}
				</MessageContentContainer>
			</MessageHeaderWrapper>
		),
		[message, contextMenuItems],
	);

	const constructDefaultMessage = React.useCallback(
		() =>
			withMessageHeader(
				<MessageContent sending={isSending} failed={isFailed}>
					{message.type !== MessageType.Default && (
						<div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
							MessageType({MessageType[message.type]})
						</div>
					)}
					{parseMessageContent(message.content)}
					{"edited_timestamp" in message && message.edited_timestamp && (
						<MessageTimestamp date={message.edited_timestamp}>
							<span style={{ color: "var(--text-secondary)", fontSize: "12px", paddingLeft: "5px" }}>
								(edited)
							</span>
						</MessageTimestamp>
					)}
					{"attachments" in message
						? message.attachments.map((attachment, index) => (
								<Fragment key={index}>
									<MessageAttachment
										key={index}
										attachment={attachment}
										contextMenuItems={contextMenuItems}
									/>
								</Fragment>
						  ))
						: null}
					{"embeds" in message
						? message.embeds.map((embed, index) => (
								<Fragment key={index}>
									<MessageEmbed key={index} embed={embed} contextMenuItems={contextMenuItems} />
								</Fragment>
						  ))
						: null}
				</MessageContent>,
				isHeader,
			),
		[message, isHeader],
	);

	const constructJoinMessage = React.useCallback(() => {
		const joinMessage = message.getJoinMessage();
		return (
			<SystemMessage
				message={message}
				iconProps={{ icon: "mdiArrowRight", size: "16px", color: "var(--success)" }}
			>
				{reactStringReplace(joinMessage, "{author}", (_, i) => (
					<Link color="var(--text)" style={{ fontWeight: "var(--font-weight-medium)" }} key={i}>
						{message.author.username}
					</Link>
				))}
			</SystemMessage>
		);
	}, [message]);

	// handles creating the message content based on the message type
	const renderMessageContent = React.useCallback(() => {
		switch (message.type) {
			case MessageType.Default:
				return constructDefaultMessage();
			case MessageType.UserJoin:
				return constructJoinMessage();
			default:
				return constructDefaultMessage();
		}
	}, [message, isSending, isFailed]);

	return (
		<MessageListItem>
			<Container
				isHeader={isHeader}
				onContextMenu={(e) => {
					e.preventDefault();
					contextMenu.open({
						position: {
							x: e.pageX,
							y: e.pageY,
						},
						items: contextMenuItems,
					});
				}}
			>
				<MessageBase>{renderMessageContent()}</MessageBase>
			</Container>
		</MessageListItem>
	);
}

export default observer(Message);
