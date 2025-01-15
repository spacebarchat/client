import { MessageType } from "@spacebarchat/spacebar-api-types/v9";
import { MessageGroup as MessageGroupType } from "@stores/MessageStore";
import { observer } from "mobx-react-lite";
import Message from "./Message";
import SystemMessage from "./SystemMessage";

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
				if (message.type === MessageType.Default || message.type === MessageType.Reply) {
					return <Message key={message.id} message={message} header={index === messages.length - 1} />;
				} else return <SystemMessage key={message.id} message={message} />;
			})}
		</>
	);
}

export default observer(MessageGroup);
