import { MessageType } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import Moment from "react-moment";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { MessageLike } from "../../stores/objects/Message";
import { calendarStrings } from "../../utils/i18n";
import Avatar from "../Avatar";
import { Link } from "../Link";
import { IContextMenuItem } from "./../ContextMenuItem";
import MessageAttachment from "./MessageAttachment";
import MessageEmbed from "./MessageEmbed";
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
`;

const MessageAuthor = styled.div`
	font-size: 16px;
	font-weight: var(--font-weight-medium);
`;

const MessageTimestamp = styled.div`
	font-size: 14px;
	font-weight: var(--font-weight-regular);
	margin-left: 10px;
	color: var(--text-secondary);
`;

const MessageContent = styled.div<{ sending?: boolean; failed?: boolean }>`
	font-size: 16px;
	font-weight: var(--font-weight-light);
	white-space: pre-wrap;
	word-wrap: anywhere;
	opacity: ${(props) => (props.sending ? 0.5 : undefined)};
	color: ${(props) => (props.failed ? "var(--error)" : undefined)};
`;

// converts URLs in a string to html links
const Linkify = ({ children }: { children: string }) => {
	const urlPattern = /\bhttps?:\/\/\S+\b\/?/g;
	const matches = children.match(urlPattern);
	if (!matches) return <>{children}</>;

	const elements = [];
	let lastIndex = 0;

	for (const match of matches) {
		const matchIndex = children.indexOf(match, lastIndex);
		if (matchIndex > lastIndex) elements.push(children.substring(lastIndex, matchIndex));

		elements.push(
			<Link key={matchIndex} href={match} target="_blank" rel="noreferrer">
				{match}
			</Link>,
		);
		lastIndex = matchIndex + match.length;
	}

	if (lastIndex < children.length) elements.push(children.substring(lastIndex));

	return <>{elements}</>;
};

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

	// construct the context menu options
	// React.useEffect(() => {
	// 	// if the message is queued, we don't need a context menu
	// 	if (isSending) {
	// 		return;
	// 	}

	// 	// add delete/resend option if the current user is the message author
	// 	// if (author?.id === domain.account?.id) {
	// 	//   items.push({
	// 	// 	label: failed ? 'Resend Message' : 'Delete Message',
	// 	// 	onPress: () => {
	// 	// 	  // TODO: implement
	// 	// 	  console.debug(
	// 	// 		failed ? 'should resend message' : 'should delete message',
	// 	// 	  );
	// 	// 	},
	// 	// 	color: theme.colors.palette.red40,
	// 	// 	iconProps: {
	// 	// 	  name: failed ? 'reload' : 'delete',
	// 	// 	},
	// 	//   });
	// 	// }

	// 	// setContextMenuOptions(items);
	// }, [isSending, isFailed]);

	// handles creating the message content based on the message type
	// TODO: probably move this to a separate component
	const renderMessageContent = React.useCallback(() => {
		switch (message.type) {
			case MessageType.Default:
				return (
					<MessageContent sending={isSending} failed={isFailed}>
						{message.content ? <Linkify>{message.content}</Linkify> : null}
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
										<MessageEmbed key={index} embed={embed} contextMenuItems={contextMenuItems} />;
									</Fragment>
							  ))
							: null}
					</MessageContent>
				);
			case MessageType.UserJoin: {
				// TODO: render only the join message and timestamp, will require a bit of refactoring
				const msg = message.getJoinMessage();
				const split = msg.split("{author}");
				return (
					<MessageContent
						style={{
							color: "var(--text-secondary)",
							fontWeight: "var(--font-weight-regular)",
							fontSize: "16px",
						}}
					>
						{split[0]}
						<Link color="var(--text)" style={{ fontWeight: "var(--font-weight-medium)" }}>
							{message.author.username}
						</Link>
						{split[1]}
					</MessageContent>
				);
			}
			default:
				return (
					<div>
						<div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
							MessageType({MessageType[message.type]})
						</div>
						{message.content}
					</div>
				);
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
				{isHeader && (
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

				<MessageContentContainer isHeader={isHeader}>
					{isHeader && (
						<MessageHeader>
							<MessageAuthor>{message.author.username}</MessageAuthor>

							<MessageTimestamp>
								<Moment calendar={calendarStrings} date={new Date(message.timestamp)} />
							</MessageTimestamp>
						</MessageHeader>
					)}

					{renderMessageContent()}

					{"files" in message && message.files?.length !== 0 && (
						<AttachmentUploadProgress message={message} />
					)}
				</MessageContentContainer>
			</Container>
		</MessageListItem>
	);
}

export default observer(Message);
