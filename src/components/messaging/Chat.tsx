import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import styled from "styled-components";
import { useAppStore } from "../../hooks/useAppStore";
import useLogger from "../../hooks/useLogger";
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
	const app = useAppStore();
	const readstate = app.readStateStore.get(channel.id);

	useEffect(() => {
		channel.markAsRead();
	}, [channel, guild]);

	return (
		<Container>
			<MessageList guild={guild} channel={channel} before={readstate?.lastMessageId} />
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
	const { activeChannel, activeGuild, activeChannelId, activeGuildId } = app;

	React.useEffect(() => {
		if (!activeChannel || !activeGuild || activeChannelId === "@me") return;

		runInAction(() => {
			app.gateway.onChannelOpen(activeGuildId!, activeChannelId!);
		});
	}, [activeChannel, activeGuild]);

	if (activeGuildId && activeGuildId === "@me") {
		return (
			<WrapperTwo>
				<span
					style={{
						padding: "1rem",
						userSelect: "none",
					}}
				>
					Home Section Placeholder
				</span>
			</WrapperTwo>
		);
	}

	if (!activeGuild || !activeChannel) {
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

	if (!activeChannel.hasPermission("VIEW_CHANNEL")) {
		return (
			<WrapperTwo>
				<span
					style={{
						color: "var(--text-secondary)",
						fontSize: "1.5rem",
						margin: "auto",
					}}
				>
					You do not have permission to view this channel
				</span>
			</WrapperTwo>
		);
	}

	return (
		<WrapperTwo>
			<ChatHeader channel={activeChannel} />
			<Content channel={activeChannel} guild={activeGuild} />
		</WrapperTwo>
	);
}

export default observer(Chat);
