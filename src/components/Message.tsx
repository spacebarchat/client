import styled from "styled-components";
import { QueuedMessage } from "../stores/MessageQueue";
import { default as MessageObject } from "../stores/objects/Message";
import Avatar from "./Avatar";

type MessageLike = MessageObject | QueuedMessage;

const MessageListItem = styled.li``;

const Container = styled.div<{ isHeader?: boolean }>`
	display: flex;
	flex-direction: row;
	padding: 2px 12px;
	align-items: center;
	margin-top: ${(props) => (props.isHeader ? "20px" : undefined)};
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

interface Props {
	message: MessageLike;
	isHeader?: boolean;
	isSending?: boolean;
	isFailed?: boolean;
}

function Message({ message, isHeader, isSending, isFailed }: Props) {
	return (
		<MessageListItem>
			<Container isHeader={isHeader}>
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
							<MessageAuthor>
								{message.author.username}
							</MessageAuthor>

							<MessageTimestamp>
								{message.timestamp.toLocaleTimeString()}
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
