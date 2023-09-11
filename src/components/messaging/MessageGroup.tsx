import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import styled from "styled-components";
import { default as MessageObject } from "../../stores/objects/Message";
import QueuedMessage, { QueuedMessageStatus } from "../../stores/objects/QueuedMessage";
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
	return (
		<Container>
			{messages.map((message, index) => (
				<Fragment key={message.id}>
					<Message
						message={message}
						isHeader={index === 0}
						isSending={"status" in message && message.status === QueuedMessageStatus.SENDING}
						isFailed={"status" in message && message.status === QueuedMessageStatus.FAILED}
					/>
				</Fragment>
			))}
		</Container>
	);
}

export default observer(MessageGroup);
