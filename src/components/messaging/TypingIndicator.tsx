import { Channel } from "@structures";
import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";

const Container = styled.div`
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

const Wrapper = styled.div`
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

function TypingIndicator({ channel }: Props) {
	if (channel.typingUsers.length > 0) {
		channel.typingUsers.sort((a, b) => a.username.toUpperCase().localeCompare(b.username.toUpperCase()));

		let text;
		if (channel.typingUsers.length >= 5) {
			text = <TypingText>Several people are typing...</TypingText>;
		} else if (channel.typingUsers.length > 1) {
			const userlist = channel.typingUsers.map((x) => x.username);
			const user = userlist.pop();

			text = (
				<TypingText>
					{userlist.map((x, i) => (
						<Fragment key={i}>
							<Bold>{x}</Bold>
							{i !== userlist.length - 1 ? ", " : ""}
						</Fragment>
					))}{" "}
					and <Bold>{user}</Bold> are typing...
				</TypingText>
			);
		} else {
			text = (
				<TypingText>
					<Bold>{channel.typingUsers[0].username}</Bold> is typing...
				</TypingText>
			);
		}

		return (
			<Container>
				<Wrapper>
					<PulseLoader size={6} color="var(--text)" />
					<TypingText>{text}</TypingText>
				</Wrapper>
			</Container>
		);
	}

	return null;
}

export default observer(TypingIndicator);
