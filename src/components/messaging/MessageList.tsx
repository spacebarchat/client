import { observer } from "mobx-react-lite";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PulseLoader from "react-spinners/PulseLoader";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";
import { useAppStore } from "../../hooks/useAppStore";
import useLogger from "../../hooks/useLogger";
import { MessageGroup as MessageGroupType } from "../../stores/MessageStore";
import Channel from "../../stores/objects/Channel";
import Guild from "../../stores/objects/Guild";
import { Permissions } from "../../utils/Permissions";
import { HorizontalDivider } from "../Divider";
import MessageGroup from "./MessageGroup";

export const MessageAreaWidthContext = React.createContext(0);
export const MESSAGE_AREA_PADDING = 82;

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
	before?: string;
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
	const ref = React.useRef<HTMLDivElement>(null);
	const { width } = useResizeObserver<HTMLDivElement>({ ref });

	React.useEffect(() => {
		const permission = Permissions.getPermission(app.account!.id, guild, channel);
		const hasPermission = permission.has("READ_MESSAGE_HISTORY");
		setCanView(hasPermission);

		if (!hasPermission) {
			logger.debug("User cannot view this channel. Aborting initial message fetch.");
			return;
		}

		if (guild && channel && channel.messages.count === 0) {
			channel.getMessages(app, true).then((r) => {
				if (r < 50) {
					setHasMore(false);
				}
			});
		}

		return () => {
			logger.debug("MessageList unmounted");
			setHasMore(true);
			setCanView(false);
		};
	}, [guild, channel]);

	const fetchMore = React.useCallback(() => {
		if (!channel.messages.count) {
			logger.warn("channel has no messages, aborting!");
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
			if (r < 50) {
				setHasMore(false);
			}
		});
	}, [channel, messageGroups]);

	const renderGroup = React.useCallback(
		(group: MessageGroupType) => (
			<MessageGroup key={`messageGroup-${group.messages[group.messages.length - 1].id}`} group={group} />
		),
		[messageGroups],
	);

	return (
		<MessageAreaWidthContext.Provider value={(width ?? 0) - MESSAGE_AREA_PADDING}>
			<Container id="scrollable-div" ref={ref}>
				{canView ? (
					<InfiniteScroll
						dataLength={messageGroups.length}
						next={fetchMore}
						style={{
							display: "flex",
							flexDirection: "column-reverse",
							marginBottom: 30,
							overflow: "hidden",
						}} // to put endMessage and loader to the top.
						hasMore={hasMore}
						inverse={true}
						loader={
							<PulseLoader
								style={{
									display: "flex",
									justifyContent: "center",
									alignContent: "center",
									margin: 30,
								}}
								color="var(--primary)"
							/>
						}
						// FIXME: seems to be broken in react-infinite-scroll-component when using inverse
						scrollThreshold={0.5}
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
		</MessageAreaWidthContext.Provider>
	);
}

export default observer(MessageList);
