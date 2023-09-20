import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import Message, { MessageLike } from "../../stores/objects/Message";
import { calendarStrings } from "../../utils/i18n";
import Tooltip from "../Tooltip";

interface Props {
	header?: boolean;
	failed?: boolean;
	sending?: boolean;
	mention?: boolean;
}

export default styled.div<Props>`
	display: flex;
	overflow: none;
	flex-direction: row;
	${(props) => props.header && "margin-top: 20px;"}
	${(props) => props.failed && "color: var(--error);"}
	${(props) => props.sending && "opacity: 0.5;"}
	${(props) => props.mention && "background-color: var(--mention);"}

	.message-details {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.message-details > .name {
		font-weight: var(--font-weight-medium);
	}

	&:hover {
		background-color: var(--background-primary-highlight);

		time,
		.edited {
			opacity: 1;
		}
	}
`;

export const MessageInfo = styled.div<{ click: boolean }>`
	width: 62px;
	display: flex;
	flex-shrink: 0;
	padding-top: 2px;
	flex-direction: row;
	justify-content: center;

	.messageTimestampWrapper {
		display: flex;
		flex-direction: column;
	}

	time,
	.edited {
		opacity: 0;
		font-size: 12px;
		color: var(--text-secondary);
	}
`;

export const MessageContent = styled.div`
	position: relative;
	min-width: 0;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-right: 48px;
`;

export const DetailBase = styled.div`
	flex-shrink: 0;
	font-size: 12px;
	display: inline-flex;
	color: var(--text-secondary);
	padding-left: 4px;
	align-self: center;

	.edited {
		cursor: default;
		user-select: none;
	}
`;

export const MessageDetails = observer(({ message, position }: { message: MessageLike; position: "left" | "top" }) => {
	if (position === "left") {
		if (message instanceof Message && message.edited_timestamp) {
			return (
				<div className="messageTimestampWrapper">
					<Tooltip title={dayjs(message.timestamp).format("dddd, MMMM MM, h:mm A")}>
						<time className="copyTime" dateTime={message.edited_timestamp.toISOString()}>
							{dayjs(message.edited_timestamp).format("h:mm A")}
						</time>
					</Tooltip>
					<span className="edited">
						<Tooltip title={dayjs(message.edited_timestamp).format("dddd, MMMM MM, h:mm A")}>
							<span>(edited)</span>
						</Tooltip>
					</span>
				</div>
			);
		}
		return (
			<>
				<time dateTime={message.timestamp.toISOString()}>{dayjs(message.timestamp).format("h:mm A")}</time>
			</>
		);
	}

	return (
		<DetailBase>
			<Tooltip title={dayjs(message.timestamp).format("dddd, MMMM MM, h:mm A")}>
				<time className="copyTime" dateTime={message.timestamp.toISOString()}>
					{dayjs(message.timestamp).calendar(undefined, calendarStrings)}
				</time>
			</Tooltip>
			{message instanceof Message && message.edited_timestamp && (
				<Tooltip title={dayjs(message.edited_timestamp).format("dddd, MMMM MM, h:mm A")}>
					<span className="edited">(edited)</span>
				</Tooltip>
			)}
		</DetailBase>
	);
});
