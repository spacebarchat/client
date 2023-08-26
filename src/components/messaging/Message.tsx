import { MessageType } from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import Moment from "react-moment";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import useLogger from "../../hooks/useLogger";
import { QueuedMessage } from "../../stores/MessageQueue";
import { default as MessageObject } from "../../stores/objects/Message";
import { calendarStrings } from "../../utils/i18n";
import Avatar from "../Avatar";
import { IContextMenuItem } from "./../ContextMenuItem";

type MessageLike = MessageObject | QueuedMessage;

const MessageListItem = styled.li``;

const Container = styled.div<{ isHeader?: boolean }>`
	display: flex;
	flex-direction: row;
	position: relative;
	padding: 2px 12px;

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
`;

const MessageTimestamp = styled.div`
	margin-left: 10px;
	color: var(--text-secondary);
`;

const MessageContent = styled.div<{ sending?: boolean; failed?: boolean }>`
	font-size: 16px;
	white-space: pre-wrap;
	word-wrap: anywhere;
	opacity: ${(props) => (props.sending ? 0.5 : undefined)};
	color: ${(props) => (props.failed ? "var(--error)" : undefined)};
`;

// max width/height for images
const maxWidth = 400;
const maxHeight = 300;

function calculateImageRatio(width: number, height: number) {
	let o = 1;
	width > maxWidth && (o = maxWidth / width);
	width = Math.round(width * o);
	let a = 1;
	(height = Math.round(height * o)) > maxHeight && (a = maxHeight / height);
	return Math.min(o * a, 1);
}

function calculateScaledDimensions(
	originalWidth: number,
	originalHeight: number,
	ratio: number,
): { scaledWidth: number; scaledHeight: number } {
	const deviceResolution = window.devicePixelRatio ?? 1;
	let scaledWidth = originalWidth;
	let scaledHeight = originalHeight;

	if (ratio < 1) {
		scaledWidth = Math.round(originalWidth * ratio);
		scaledHeight = Math.round(originalHeight * ratio);
	}

	scaledWidth = Math.min(scaledWidth, maxWidth);
	scaledHeight = Math.min(scaledHeight, maxHeight);

	if (scaledWidth !== originalWidth || scaledHeight !== originalHeight) {
		scaledWidth |= 0;
		scaledHeight |= 0;
	}

	scaledWidth *= deviceResolution;
	scaledHeight *= deviceResolution;

	return { scaledWidth, scaledHeight };
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
	const logger = useLogger("Message.tsx");
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

					{message.type === MessageType.Default ? (
						<MessageContent sending={isSending} failed={isFailed}>
							{message.content}
							{"attachments" in message &&
								message.attachments.map((attachment) => {
									// return (
									// 	<div key={attachment.id}>

									// 	</div>
									// );
									if (attachment.content_type?.startsWith("image")) {
										const ratio = calculateImageRatio(attachment.width!, attachment.height!);
										const { scaledWidth, scaledHeight } = calculateScaledDimensions(
											attachment.width!,
											attachment.height!,
											ratio,
										);

										console.log(attachment.filename, scaledWidth, scaledHeight);

										return (
											<div key={attachment.id}>
												<img
													src={attachment.url}
													alt={attachment.filename}
													width={scaledWidth}
													height={scaledHeight}
												/>
											</div>
										);
									} else if (attachment.content_type?.startsWith("video")) {
										return (
											<div key={attachment.id}>
												<video controls>
													<source src={attachment.url} type={attachment.content_type} />
												</video>
											</div>
										);
									} else {
										logger.warn(`Unknown attachment type: ${attachment.content_type}`);
									}
								})}
						</MessageContent>
					) : (
						<div>
							<div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
								MessageType({MessageType[message.type]})
							</div>
							{message.content ?? "No Content"}
						</div>
					)}
				</MessageContentContainer>
			</Container>
		</MessageListItem>
	);
}

export default Message;
