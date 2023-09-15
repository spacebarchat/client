import { observer } from "mobx-react-lite";
import { MessageGroup as MessageGroupType } from "../../stores/MessageStore";
import { QueuedMessageStatus } from "../../stores/objects/QueuedMessage";
import Message from "./Message";

interface Props {
	group: MessageGroupType;
}

/**
 * Component that handles rendering a group of messages from the same author
 */
function MessageGroup({ group }: Props) {
	const { messages } = group;
	return (
		<>
			{messages.map((message, index) => {
				return (
					<Message
						key={message.id}
						message={message}
						isHeader={index === messages.length - 1}
						isSending={"status" in message && message.status === QueuedMessageStatus.SENDING}
						isFailed={"status" in message && message.status === QueuedMessageStatus.FAILED}
					/>
				);
			})}
		</>
	);
}

export default observer(MessageGroup);
