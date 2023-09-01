import { observer } from "mobx-react-lite";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import Channel from "../../stores/objects/Channel";
import Guild from "../../stores/objects/Guild";
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

interface Props {
	channel?: Channel;
	guild?: Guild;
}

/**
 * Main component for rendering channel messages
 */
function Chat({ channel, guild }: Props) {
	const app = useAppStore();
	const logger = useLogger("Messages");

	// React.useEffect(() => {
	// 	if (!channel || !guild) return;

	// 	runInAction(() => {
	// 		app.gateway.onChannelOpen(guild.id, channel.id);
	// 	});
	// }, [channel, guild]);

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
				<MessageInput channel={channel} />
			</Container>
		</Wrapper>
	);
}

export default observer(Chat);
