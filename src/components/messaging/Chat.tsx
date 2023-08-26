import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1 1 100%;
	background-color: var(--background-primary-alt);
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	overflow: hidden;
	position: relative;
`;

const Spacer = styled.div`
	margin-bottom: 30px;
`;

/**
 * Main component for rendering channel messages
 */
function Chat() {
	const app = useAppStore();
	const logger = useLogger("Messages");

	const { guildId, channelId } = useParams<{
		guildId: string;
		channelId: string;
	}>();
	const guild = app.guilds.get(guildId!);
	const channel = guild?.channels.get(channelId!);

	if (!guild || !channel) {
		return (
			<Wrapper>
				<ChatHeader channel={channel} />
				<span>{!guild ? "Unknown Guild" : "Unknown Channel"}</span>
			</Wrapper>
		);
	}

	return (
		<Wrapper>
			<ChatHeader channel={channel} />
			<Container>
				<MessageList guild={guild} channel={channel} />
				<Spacer />
				<MessageInput channel={channel} />
			</Container>
		</Wrapper>
	);
}

export default observer(Chat);
