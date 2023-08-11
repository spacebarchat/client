import { observer } from "mobx-react-lite";
import React, { memo } from "react";
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
	background-color: var(--background-primary-alt);
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
	flex: 1 1 auto;
	overflow: hidden;
	position: relative;
`;

const Spacer = styled.div`
	height: 30px;
	width: 1px;
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
		if (guild && channel) {
			channel.getMessages(app, true);
		}
	}, [guild, channel]);

	if (!guild || !channel) {
		return (
			<Wrapper>
				<ChatHeader channel={channel} />
				<span>{!guild ? "Unknown Guild" : "Unknown Channel"}</span>
			</Wrapper>
		);
	}

	const messages = [
		...(channel.messages.messages ?? []),
		...(channel ? app.queue.get(channel.id) ?? [] : []),
	];

	return (
		<Wrapper>
			<ChatHeader channel={channel} />
			<Container>
				<MessageListWrapper>
					<List>
						{messages.map((message, index, arr) => {
							const t = 1 * 24 * 60 * 60 * 1000;

							const isHeader =
								index === 0 ||
								message.author.id !==
									arr[index - 1].author.id ||
								message.timestamp.getTime() -
									arr[index - 1].timestamp.getTime() >
									t;

							return (
								<Message
									key={message.id}
									message={message}
									isHeader={isHeader}
									isSending={
										"status" in message &&
										message.status ===
											QueuedMessageStatus.SENDING
									}
									isFailed={
										"status" in message &&
										message.status ===
											QueuedMessageStatus.FAILED
									}
								/>
							);
						})}
						<Spacer />
					</List>
				</MessageListWrapper>
				<MessageInput channel={channel} />
			</Container>
		</Wrapper>
	);
}

export default observer(Chat);
