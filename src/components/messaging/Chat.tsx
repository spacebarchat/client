import { observer } from "mobx-react-lite";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import Channel from "../../stores/objects/Channel";
import Guild from "../../stores/objects/Guild";
import MemberList from "../MemberList/MemberList";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";

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

function ChatContent({ channel, guild }: Props2) {
	return (
		<Container>
			<MessageList guild={guild} channel={channel} />
			<MessageInput channel={channel} guild={guild} />
			<TypingIndicator channel={channel} />
		</Container>
	);
}

const Content = observer((props: Props2) => {
	const { memberListVisible } = useAppStore();

	return (
		<WrapperOne>
			<ChatContent {...props} />
			{memberListVisible && <MemberList />}
		</WrapperOne>
	);
});

/**
 * Main component for rendering channel messages
 */
function Chat() {
	const app = useAppStore();
	const logger = useLogger("Messages");

	// React.useEffect(() => {
	// 	if (!app.activeChannel || !app.activeGuild || app.activeChannelId === "@me") return;

	// 	runInAction(() => {
	// 		app.gateway.onChannelOpen(app.activeGuildId!, app.activeChannelId!);
	// 	});
	// }, [app.activeChannel, app.activeGuild]);

	if (app.activeGuildId && app.activeGuildId === "@me") {
		return (
			<WrapperTwo>
				<span>Home Section Placeholder</span>
			</WrapperTwo>
		);
	}

	if (!app.activeGuild || !app.activeChannel) {
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
			<ChatHeader channel={app.activeChannel} />
			<Content channel={app.activeChannel} guild={app.activeGuild} />
		</WrapperTwo>
	);
}

export default observer(Chat);
