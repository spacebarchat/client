import { observer } from "mobx-react-lite";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import { useAppStore } from "../../stores/AppStore";
import Channel from "../../stores/objects/Channel";

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
	const app = useAppStore();

	if (channel.typingUsers.length > 0) {
		channel.typingUsers.sort((a, b) => a.username.toUpperCase().localeCompare(b.username.toUpperCase()));

		let text;
		if (channel.typingUsers.length >= 5) {
			text = <TypingText>Several people are typing...</TypingText>;
		} else if (channel.typingUsers.length > 1) {
			const userlist = channel.typingUsers.map((x) => <Bold>{x.username}</Bold>);
			const user = userlist.pop();

			text = (
				<TypingText>
					{userlist.join(", ")} and <Bold>{user}</Bold> are typing...
				</TypingText>
			);
		} else {
			text = (
				<TypingText>
					<Bold>{channel.typingUsers[0].username} is typing...</Bold>
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
