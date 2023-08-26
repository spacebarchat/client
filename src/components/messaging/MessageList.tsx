import { observer } from "mobx-react-lite";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PulseLoader } from "react-spinners";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import Channel from "../../stores/objects/Channel";
import Guild from "../../stores/objects/Guild";
import { HorizontalDivider } from "../Divider";
import MessageGroup from "./MessageGroup";

const Container = styled.div`
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column-reverse;
`;

const EndMessageContainer = styled.div`
	margin: 16px 16px 0 16px;
`;

interface Props {
	guild: Guild;
	channel: Channel;
}

/**
 * Main component for rendering the messages list of a channel
 */
function MessageList({ guild, channel }: Props) {
	const app = useAppStore();
	const logger = useLogger("MessageList.tsx");
	// const messages = [...(channel.messages.messages ?? []), ...(channel ? app.queue.get(channel.id) ?? [] : [])];
	const [hasMore, setHasMore] = React.useState(true);

	// handles the initial fetch of channel messages
	React.useEffect(() => {
		if (guild && channel && channel.messages.count === 0) {
			channel.getMessages(app, true).then((r) => {
				if (r < 50) {
					setHasMore(false);
				}
			});
		}
	}, [guild, channel]);

	const fetchMore = async () => {
		if (!channel.messages.count) {
			return;
		}
		// get first message in the list to use as before
		const before = channel.messages.grouped[0][0].id;
		logger.debug(`Fetching 50 messages before ${before} for channel ${channel.id}`);
		channel.getMessages(app, false, 50, before).then((r) => {
			if (r < 50) {
				setHasMore(false);
			}
		});
	};

	return (
		<Container id="scrollable-div">
			<InfiniteScroll
				dataLength={channel.messages.grouped.length}
				next={fetchMore}
				style={{ display: "flex", flexDirection: "column-reverse" }} // to put endMessage and loader to the top.
				hasMore={hasMore}
				loader={
					<PulseLoader
						style={{ display: "flex", justifyContent: "center", alignContent: "center" }}
						color="var(--primary)"
					/>
				}
				scrollableTarget="scrollable-div"
				endMessage={
					<EndMessageContainer>
						<h1 style={{ fontWeight: 700, margin: "8px 0" }}>Welcome to #{channel.name}!</h1>
						<p style={{ color: "var(--text-secondary)" }}>
							This is the start of the #{channel.name} channel.
						</p>
						<HorizontalDivider />
					</EndMessageContainer>
				}
			>
				{channel.messages.grouped.map((group, index) => {
					return <MessageGroup key={index} messages={group} />;
				})}
			</InfiniteScroll>
		</Container>
	);
}

export default observer(MessageList);
