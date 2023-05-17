import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import ChatHeader from "./ChatHeader";
import Container from "./Container";

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: column;
	flex: 1 1 100%;
	background-color: var(--background-primary);
`;

function Chat() {
	const app = useAppStore();
	const { guildId, channelId } = useParams<{
		guildId: string;
		channelId: string;
	}>();
	const guild = app.guilds.get(guildId!);
	const channel = guild?.channels.get(channelId!);

	if (!guild)
		return (
			<Wrapper>
				<ChatHeader channel={channel} />
				<span>Unknown Guild</span>
			</Wrapper>
		);

	return (
		<Wrapper>
			<ChatHeader channel={channel} />
			<span>Chat</span>
		</Wrapper>
	);
}

export default Chat;
