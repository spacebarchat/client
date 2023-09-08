import { observer } from "mobx-react-lite";
import React from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import Channel from "../../stores/objects/Channel";

const Typing = styled.div`
	overflow: visible;
	position: absolute;
	bottom: 1px;
	left: 16px;
	right: 16px;
	height: 24px;
	font-size: 14px;
	font-weight: var(--font-weight-medium);
	resize: none;
	display: flex;
	align-items: center;
	color: var(--text);
`;

const TypingIndicator = styled.div`
	display: flex;
	align-items: center;
	overflow: hidden;
`;

const TypingText = styled.span`
	white-space: nowrap;
	margin-left: 4px;
	font-weight: var(--font-weight-light);
`;

const Bold = styled.b`
	font-weight: var(--font-weight-medium);
	font-size: 14px;
`;

interface Props {
	channel: Channel;
}

function TypingStatus({ channel }: Props) {
	const getFormattedString = React.useCallback(() => {
		const typingUsers = channel.typingUsers;
		const userCount = typingUsers.length;

		if (userCount === 0) {
			return "";
		} else if (userCount === 1) {
			return (
				<>
					<Bold>{typingUsers[0].username}</Bold> is typing...
				</>
			);
		} else if (userCount === 2) {
			return typingUsers.map((user) => <Bold>{user.username}</Bold>).join(" and ") + " are typing...";
		} else if (userCount === 3) {
			return (
				typingUsers
					.slice(0, 2)
					.map((user) => <Bold>${user.username}</Bold>)
					.join(", ") +
				(
					<>
						and <Bold>${typingUsers[2].username}</Bold> are typing...
					</>
				)
			);
		} else {
			return <>Several people are typing...</>;
		}
	}, [channel]);

	if (!channel.typingUsers.length) return null;

	return (
		<Typing>
			<TypingIndicator>
				<PulseLoader size={6} color="var(--text)" />
				<TypingText>{getFormattedString()}</TypingText>
			</TypingIndicator>
		</Typing>
	);
}

export default observer(TypingStatus);
