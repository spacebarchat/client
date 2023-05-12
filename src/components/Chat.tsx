import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import Container from "./Container";

const Wrapper = styled(Container)`
	display: flex;
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
	if (!guild) return <Wrapper>Invalid Guild ID</Wrapper>;
	return <Wrapper>Chat</Wrapper>;
}

export default Chat;
