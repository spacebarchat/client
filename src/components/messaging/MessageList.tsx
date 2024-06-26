import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { PulseLoader } from "react-spinners";
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
	const [loading, setLoading] = useState(false);
	const messageGroups = channel.messages.groups;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const { width } = useResizeObserver<HTMLDivElement>({ ref: wrapperRef });
	const ref = useRef<VListHandle>(null);

	useEffect(() => {
		ref.current?.scrollToIndex(
			messageGroups.reduce((p, c) => p + c.messages.length, 0) +
				1 /* +1 to account for the spacer that adds some margin to the bottom */,
		);
	}, [messageGroups]);

	const fetchMore = React.useCallback(() => {
		setLoading(true);
		if (!channel.messages.count) {
			logger.warn("channel has no messages, aborting!");
			setLoading(false);
			return;
		}
		// get last group
		const lastGroup = messageGroups[messageGroups.length - 1];
		if (!lastGroup) {
			logger.warn("No last group found, aborting fetchMore");
			setLoading(false);
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
		setLoading(false);
	}, [channel, messageGroups]);

	useEffect(() => {
		const permission = Permissions.getPermission(app.account!.id, guild, channel);
		const hasPermission = permission.has("READ_MESSAGE_HISTORY");
		setCanView(hasPermission);

		if (!hasPermission) {
			logger.debug("User cannot view this channel. Aborting initial message fetch.");
			return;
		}

		if (guild && channel && channel.messages.count === 0) {
			channel.getMessages(app, true, 50, before).then((r) => {
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

	const renderGroup = React.useCallback(
		(group: MessageGroupType) => (
			<MessageGroup key={`messageGroup-${group.messages[group.messages.length - 1].id}`} group={group} />
		),
		[messageGroups],
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
						reverse
					>
						{((messageGroups.length === 0 && !loading) || (!loading && !hasMore)) && (
							<EndMessageContainer>
								<h1 style={{ fontWeight: 700, margin: "8px 0" }}>Welcome to #{channel.name}!</h1>
								<p style={{ color: "var(--text-secondary)" }}>
									This is the start of the #{channel.name} channel.
								</p>
								<HorizontalDivider />
							</EndMessageContainer>
						)}
						{loading && (
							<PulseLoader
								style={{
									display: "flex",
									justifyContent: "center",
									alignContent: "center",
									margin: 30,
								}}
								color="var(--primary)"
							/>
						)}
						{messageGroups.map((group, index) => renderGroup(group))}
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
