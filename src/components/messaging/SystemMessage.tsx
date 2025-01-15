import Icon from "@components/Icon";
import * as Icons from "@mdi/js";
import { MessageType } from "@spacebarchat/spacebar-api-types/v9";
import { MessageLike } from "@structures";
import { observer } from "mobx-react-lite";
import ReactMarkdown from "react-markdown";
import reactStringReplace from "react-string-replace";
import styled from "styled-components";
import MessageBase, { MessageDetails, MessageInfo } from "./MessageBase";

const SystemContent = styled.div`
	display: flex;
	padding: 2px 0;
	flex-wrap: wrap;
	align-items: center;
	flex-direction: row;
	font-size: 16px;
	color: var(--text-secondary);
`;

const SystemUser = styled.span`
	color: var(--text);
	cursor: pointer;
	font-weight: var(--font-weight-medium);

	&:hover {
		text-decoration: underline;
	}
`;

interface Props {
	message: MessageLike;
	highlight?: boolean;
}

const ICONS: Partial<Record<MessageType, { icon: keyof typeof Icons; color?: string }>> = {
	[MessageType.UserJoin]: {
		icon: "mdiArrowRight",
		color: "var(--success)",
	},
};

function SystemMessage({ message, highlight }: Props) {
	const icon = ICONS[message.type] ?? {
		icon: "mdiInformation",
	};

	let children;
	switch (message.type) {
		case MessageType.UserJoin: {
			const joinMessage = message.getJoinMessage();
			children = (
				<div>
					{reactStringReplace(joinMessage, "{author}", (_, i) => (
						<SystemUser key={i}>{message.author.username}</SystemUser>
					))}
				</div>
			);

			break;
		}
		case MessageType.Default:
			children = <ReactMarkdown children={message.content} />;
			break;
		default:
			// children = <span>Unimplemented system message type '{MessageType[message.type]}'</span>;
			children = <ReactMarkdown children={message.content} />;
			break;
	}

	return (
		<MessageBase header>
			<MessageInfo>
				<Icon icon={icon.icon} size="16px" color={icon.color ?? "var(--text-secondary)"} />
			</MessageInfo>
			<SystemContent>{children}</SystemContent>
			<MessageDetails message={message} position="top" />
		</MessageBase>
	);
}

export default observer(SystemMessage);
