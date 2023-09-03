import { observer } from "mobx-react-lite";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import Channel from "../../stores/objects/Channel";
import Guild from "../../stores/objects/Guild";
import MemberList from "../MemberList";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

/**
 * Wrapps chat and member list into a row
 */
const WrapperOne = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1 1 auto;
	overflow: hidden;
`;

/**
 * Wraps the message list, header, and input into a column
 */
const WrapperTwo = styled.div`
	display: flex;
	flex-direction: column;
	background-color: var(--background-primary-alt);
	flex: 1 1 auto;
	overflow: hidden;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	position: relative;
	overflow: hidden;
`;

interface Props {
	channel?: Channel;
	guild?: Guild;
	channelId?: string;
	guildId?: string;
}

interface Props2 {
	channel: Channel;
	guild: Guild;
}

export function ChatContent({ channel, guild }: Props2) {
	return (
		<Container>
			<MessageList guild={guild} channel={channel} />
			<MessageInput channel={channel} guild={guild} />
		</Container>
	);
}

export function Content(props: Props2) {
	return (
		<WrapperOne>
			<ChatContent {...props} />
			<MemberList />
		</WrapperOne>
	);
}

/**
 * Main component for rendering channel messages
 */
function Chat({ channel, guild, guildId }: Props) {
	const app = useAppStore();
	const logger = useLogger("Messages");

	// React.useEffect(() => {
	// 	if (!channel || !guild) return;

	// 	runInAction(() => {
	// 		app.gateway.onChannelOpen(guild.id, channel.id);
	// 	});
	// }, [channel, guild]);

	if (guildId && guildId === "@me") {
		return (
			<WrapperTwo>
				<span>Home Section Placeholder</span>
			</WrapperTwo>
		);
	}

	if (!guild || !channel) {
		return (
			<WrapperTwo>
				<span
					style={{
						color: "var(--text-secondary)",
						fontSize: "1.5rem",
						margin: "auto",
					}}
				>
					Unknown Guild or Channel
				</span>
			</WrapperTwo>
		);
	}

	return (
		<WrapperTwo>
			<ChatHeader channel={channel} />
			<Content channel={channel} guild={guild} />
		</WrapperTwo>
	);
}

export default observer(Chat);
