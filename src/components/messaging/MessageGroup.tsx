import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { QueuedMessageStatus } from "../../stores/MessageQueue";
import { default as MessageObject } from "../../stores/objects/Message";
import QueuedMessage from "../../stores/objects/QueuedMessage";
import Message from "./Message";

const Container = styled.div`
	margin-top: 20px;
`;

interface Props {
	messages: (MessageObject | QueuedMessage)[];
}

/**
 * Component that handles rendering a group of messages from the same author
 */
function MessageGroup({ messages }: Props) {
	const renderMessage = React.useCallback((message: MessageObject | QueuedMessage, index: number) => {
		return (
			<Message
				key={message.id}
				message={message}
				isHeader={index === 0}
				isSending={"status" in message && message.status === QueuedMessageStatus.SENDING}
				isFailed={"status" in message && message.status === QueuedMessageStatus.FAILED}
			/>
		);
	}, []);

	return <Container>{messages.map((message, index) => renderMessage(message, index))}</Container>;
}

export default observer(MessageGroup);
