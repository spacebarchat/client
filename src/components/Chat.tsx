import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import { QueuedMessageStatus } from "../stores/MessageQueue";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import MessageInput from "./MessageInput";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1 1 100%;
	background-color: var(--background-primary);
`;

const MessageListWrapper = styled.div`
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column-reverse;
`;

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
`;

function Chat() {
	const app = useAppStore();
	const { guildId, channelId } = useParams<{
		guildId: string;
		channelId: string;
	}>();
	const guild = app.guilds.get(guildId!);
	const channel = guild?.channels.get(channelId!);

	React.useEffect(() => {
		if (!guild || !channel) return;

		// fetch channel messages
		channel?.getMessages(app, true);
	}, [guild, channel]);

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
			<Container>
				<MessageListWrapper>
					<List>
						{[
							...(channel?.messages.messages ?? []),
							...(channel
								? app.queue.get(channel?.id) ?? []
								: []),
						].map((x, i, arr) => {
							// group by author, and only if the previous message is not older than a day
							const t = 1 * 24 * 60 * 60 * 1000;

							const isHeader =
								i === 0 ||
								x.author.id !== arr[i - 1].author.id ||
								x.timestamp.getTime() -
									arr[i - 1].timestamp.getTime() >
									t;

							return (
								<Message
									key={x.id}
									message={x}
									isHeader={isHeader}
									isSending={
										"status" in x &&
										x.status === QueuedMessageStatus.SENDING
									}
									isFailed={
										"status" in x &&
										x.status === QueuedMessageStatus.FAILED
									}
								/>
							);
						})}
					</List>
				</MessageListWrapper>

				<MessageInput />
			</Container>
		</Wrapper>
	);
}

export default observer(Chat);
