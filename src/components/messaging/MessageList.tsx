import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";
import { VList, VListHandle } from "virtua";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import { MessageGroup as MessageGroupType } from "../../stores/MessageStore";
import Channel from "../../stores/objects/Channel";
import Guild from "../../stores/objects/Guild";
import { Permissions } from "../../utils/Permissions";
import { HorizontalDivider } from "../Divider";
import MessageGroup from "./MessageGroup";

const SKELETON_COUNT = 30;
export const MessageAreaWidthContext = React.createContext(0);
export const MESSAGE_AREA_PADDING = 82;

const Container = styled.div`
	display: flex;
	flex: 1;
`;

const EndMessageContainer = styled.div`
	margin: 16px 16px 0 16px;
`;

const Spacer = styled.div`
	height: 20px;
`;

interface Props {
	guild: Guild;
	channel: Channel;
	before?: string;
}

/**
 * Main component for rendering the messages list of a channel
 */
function MessageList({ guild, channel, before }: Props) {
	const app = useAppStore();
	const logger = useLogger("MessageList.tsx");
	const [hasMore, setHasMore] = useState(true);
	const [canView, setCanView] = useState(false);
	const [loading, setLoading] = useState(true);
	const { groups } = channel.messages;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const { width } = useResizeObserver<HTMLDivElement>({ ref: wrapperRef });
	const ref = useRef<VListHandle>(null);

	useEffect(() => {
		// this is for switching to a channel with cached messages, it ensures that we correctly set hasMore to false if there are messages but its less than 50
		if (channel.messages.count > 0 && channel.messages.count < 50) setHasMore(false);

		const hasSkeleton = hasMore || loading;

		// if (before) {
		// 	// find message group containing the message
		// 	const group = groups.find((x) => x.messages.some((y) => y.id === before));
		// 	const index = group
		// 		? groups.indexOf(group) +
		// 		  (hasMore
		// 				? SKELETON_COUNT
		// 				: 0) /** +10 to account for the "skeleton" divs used to add some padding for scrolling */
		// 		: -1;

		// 	ref.current?.scrollToIndex(index);
		// 	return;
		// }

		// check if we are already at the end
		if (channel.messages.count <= 50) ref.current?.scrollToIndex(channel.messages.count);
	}, [groups, channel]);

	const fetchMore = React.useCallback(() => {
		setLoading(true);
		if (!channel.messages.count) {
			logger.warn("channel has no messages, aborting!");
			setLoading(false);
			return;
		}
		// get first group (last)
		const firstGroup = groups.first();
		if (!firstGroup) {
			logger.warn("No first group found, aborting fetchMore");
			setLoading(false);
			return;
		}
		// ignore queued messages
		if ("status" in firstGroup.messages[0]) return;
		// get first message in the group to use as before
		const before = firstGroup.messages[0].id;
		console.log(firstGroup.messages.map((x) => x.content));
		logger.debug(`Fetching 50 messages before ${before} for channel ${channel.id}`);
		channel.getMessages(app, false, 50, before).then((r) => {
			if (r < 50) setHasMore(false);
			setLoading(false);
		});
	}, [channel, groups]);

	useEffect(() => {
		const permission = Permissions.getPermission(app.account!.id, guild, channel);
		const hasPermission = permission.has("READ_MESSAGE_HISTORY");
		setCanView(hasPermission);

		if (!hasPermission) {
			logger.debug("User cannot view this channel. Aborting initial message fetch.");
			return;
		}

		if (guild && channel && channel.messages.count === 0) {
			logger.debug(`Fetching 50 messages for channel ${channel.id}`);
			channel.getMessages(app, true).then((r) => {
				if (r < 50) setHasMore(false);

				setLoading(false);
			});
		} else if (channel.messages.count !== 0) {
			setLoading(false);
		}

		return () => {
			logger.debug("MessageList unmounted");
			setLoading(true);
			setHasMore(true);
			setCanView(false);
		};
	}, [guild, channel]);

	const renderGroup = React.useCallback(
		(group: MessageGroupType) => (
			<MessageGroup key={`messageGroup-${group.messages[group.messages.length - 1].id}`} group={group} />
		),
		[groups],
	);

	return (
		<MessageAreaWidthContext.Provider value={(width ?? 0) - MESSAGE_AREA_PADDING}>
			<Container>
				{canView ? (
					<VList
						ref={ref}
						style={{
							flex: 1,
						}}
						onRangeChange={(start, end) => {
							const shouldFetch = (start / groups.length) * 100 < 30;
							if (shouldFetch && hasMore && !loading) fetchMore();
						}}
						reverse
					>
						{/* {Array.from({
							length: hasMore || loading ? 30 : 0,
						}).map((_, i) => (
							<SkeletonLoader />
						))} */}
						{!loading && !hasMore && (
							<EndMessageContainer>
								<h1 style={{ fontWeight: 700, margin: "8px 0" }}>Welcome to #{channel.name}!</h1>
								<p style={{ color: "var(--text-secondary)" }}>
									This is the start of the #{channel.name} channel.
								</p>
								<HorizontalDivider />
							</EndMessageContainer>
						)}
						{groups.map((group, index) => renderGroup(group))}
						<Spacer />
					</VList>
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
