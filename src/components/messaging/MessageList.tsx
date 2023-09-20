import { observer } from "mobx-react-lite";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PulseLoader from "react-spinners/PulseLoader";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import { MessageGroup as MessageGroupType } from "../../stores/MessageStore";
import Channel from "../../stores/objects/Channel";
import Guild from "../../stores/objects/Guild";
import { Permissions } from "../../utils/Permissions";
import { HorizontalDivider } from "../Divider";
import MessageGroup from "./MessageGroup";

const Container = styled.div`
	flex: 1 1 auto;
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
	const [hasMore, setHasMore] = React.useState(true);
	const [canView, setCanView] = React.useState(false);
	const messageGroups = channel.messages.groups;

	// handles the permission check
	React.useEffect(() => {
		const permission = Permissions.getPermission(app.account!.id, guild, channel);
		setCanView(permission.has("READ_MESSAGE_HISTORY"));
	}, [guild, channel]);

	// handles the initial fetch of channel messages
	React.useEffect(() => {
		if (!canView) return;
		if (guild && channel && channel.messages.count === 0) {
			channel.getMessages(app, true).then((r) => {
				if (r !== 50) setHasMore(false);
				else setHasMore(true);
			});
		}
	}, [guild, channel, canView]);

	const fetchMore = React.useCallback(() => {
		if (!channel.messages.count) {
			return;
		}
		// get last group
		const lastGroup = messageGroups[messageGroups.length - 1];
		if (!lastGroup) {
			logger.warn("No last group found, aborting fetchMore");
			return;
		}
		// ignore queued messages
		if ("status" in lastGroup.messages[0]) return;
		// get first message in the group to use as before
		const before = lastGroup.messages[0].id;
		logger.debug(`Fetching 50 messages before ${before} for channel ${channel.id}`);
		channel.getMessages(app, false, 50, before).then((r) => {
			if (r !== 50) setHasMore(false);
			else setHasMore(true);
		});
	}, [channel, messageGroups, setHasMore]);

	const renderGroup = React.useCallback(
		(group: MessageGroupType) => <MessageGroup key={group.messages[0].id} group={group} />,
		[],
	);

	return (
		<Container id="scrollable-div">
			{canView ? (
				<InfiniteScroll
					dataLength={messageGroups.length}
					next={fetchMore}
					style={{
						display: "flex",
						flexDirection: "column-reverse",
						marginBottom: 30,
					}} // to put endMessage and loader to the top.
					hasMore={hasMore}
					inverse={true}
					loader={
						<PulseLoader
							style={{
								display: "flex",
								justifyContent: "center",
								alignContent: "center",
								marginBottom: 30,
							}}
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
					{messageGroups.map((group) => renderGroup(group))}
				</InfiniteScroll>
			) : (
				<div
					style={{
						marginBottom: 30,
						paddingLeft: 20,
						color: "var(--text-secondary)",
					}}
				>
					You do not have permission to read the history of this channel.
				</div>
			)}
		</Container>
	);
}

export default observer(MessageList);
