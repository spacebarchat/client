import React from "react";
import Moment from "react-moment";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
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
	padding: ${(props) => (props.isHeader ? "4" : "2")}px 12px;

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
	user-select: text;
`;

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

					<MessageContent sending={isSending} failed={isFailed}>
						{message.content}
					</MessageContent>
				</MessageContentContainer>
			</Container>
		</MessageListItem>
	);
}

export default Message;
