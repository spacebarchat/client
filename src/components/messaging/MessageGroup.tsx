import styled from "styled-components";
import { QueuedMessageStatus } from "../../stores/MessageQueue";
import { default as MessageObject } from "../../stores/objects/Message";
import Message from "./Message";

const Container = styled.div`
	margin-top: 20px;
`;

interface Props {
	messages: MessageObject[];
}

/**
 * Component that handles rendering a group of messages from the same author
 */
function MessageGroup({ messages }: Props) {
	return (
		<Container>
			{messages.map((message, index) => {
				return (
					<Message
						key={message.id}
						message={message}
						isHeader={index === 0}
						isSending={"status" in message && message.status === QueuedMessageStatus.SENDING}
						isFailed={"status" in message && message.status === QueuedMessageStatus.FAILED}
					/>
				);
			})}
		</Container>
	);
}

export default MessageGroup;
