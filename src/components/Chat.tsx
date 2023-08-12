import { observer } from "mobx-react-lite";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import useLogger from "../hooks/useLogger";
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
	const logger = useLogger("Chat");
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

	const fetchMore = async () => {
		if (!channel.messages.count) {
			return;
		}
		// get first message in the list to use as before
		const before = channel.messages.messages[0].id;
		logger.debug(
			`Fetching 50 messages before ${before} for channel ${channel.id}`,
		);
		await channel.getMessages(app, false, 50, before);
	};

	return (
		<Wrapper>
			<ChatHeader channel={channel} />
			<Container>
				<MessageListWrapper>
					<MessageListWrapper id="scrollable-div">
						<InfiniteScroll
							dataLength={messages.length}
							next={fetchMore}
							inverse={true}
							// TODO: change this to false when we have a fetch that returns less than 50 messages
							hasMore={true}
							loader={<h4>Loading...</h4>}
							scrollableTarget="scrollable-div"
						>
							{messages.map((message, index, arr) => {
								// calculate max ms between messages to determine if they should be grouped (if from same author). 7 minutes
								const maxTimeDifference = 1000 * 60 * 7;

								const isHeader =
									// always show header for first message
									index === 0 ||
									// show header if author is different from previous message
									message.author.id !== arr[index - 1].author.id ||
									// show header if time difference is greater than maxTimeDifference
									message.timestamp.getTime() - arr[index - 1].timestamp.getTime() > maxTimeDifference;

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
						</InfiniteScroll>
					</MessageListWrapper>
				</MessageListWrapper>
				<MessageInput channel={channel} />
			</Container>
		</Wrapper>
	);
}

export default observer(Chat);
