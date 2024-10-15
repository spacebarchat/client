import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { modalController } from "../../controllers/modals";
import { useAppStore } from "../../hooks/useAppStore";
import Channel from "../../stores/objects/Channel";
import { Permissions } from "../../utils/Permissions";
import Icon from "../Icon";
import SidebarPill from "../SidebarPill";
import Floating from "../floating/Floating";
import FloatingTrigger from "../floating/FloatingTrigger";

const ListItem = styled.div<{ isCategory?: boolean }>`
	padding: ${(props) => (props.isCategory ? "16px 8px 0 0" : "1px 8px 0 0")};
	cursor: pointer;
`;

const Wrapper = styled.div<{ isCategory?: boolean; active?: boolean }>`
	margin-left: ${(props) => (props.isCategory ? "0" : "8px")};
	height: ${(props) => (props.isCategory ? "28px" : "33px")};
	border-radius: 4px;
	align-items: center;
	display: flex;
	padding: ${(props) => (props.isCategory ? "0 8px 0 8px" : "0 16px")};
	background-color: ${(props) => (props.active ? "var(--background-primary-alt)" : "transparent")};
	justify-content: space-between;

	&:hover {
		background-color: ${(props) => (props.isCategory ? "transparent" : "var(--background-primary-alt)")};
	}
`;

const Text = styled.span<{ isCategory?: boolean; hovered?: boolean }>`
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	white-space: nowrap;
	color: ${(props) => (props.isCategory && props.hovered ? "var(--text)" : "var(--text-secondary)")};
	user-select: none;
`;

interface Props {
	channel: Channel;
	isCategory: boolean;
	active: boolean;
}

function ChannelListItem({ channel, isCategory, active }: Props) {
	const app = useAppStore();
	const navigate = useNavigate();
	const contextMenu = useContext(ContextMenuContext);

	const [wrapperHovered, setWrapperHovered] = React.useState(false);
	const [createChannelHovered, setCreateChannelHovered] = React.useState(false);
	const [createChannelDown, setChannelCreateDown] = React.useState(false);
	const [hasCreateChannelPermission, setHasCreateChannelPermission] = React.useState(false);

	useEffect(() => {
		if (!isCategory) return;

		const permission = Permissions.getPermission(app.account!.id, channel.guild, channel);
		const hasPermission = permission.has("MANAGE_CHANNELS");
		setHasCreateChannelPermission(hasPermission);
	}, [channel]);

	return (
		<ListItem
			key={channel.id}
			isCategory={isCategory}
			onClick={() => {
				// prevent navigating to non-text channels
				if (!channel.isTextChannel) return;

				navigate(`/channels/${channel.guildId}/${channel.id}`);
			}}
			ref={contextMenu.setReferenceElement}
			onContextMenu={(e) => contextMenu.onContextMenu(e, { type: "channel", channel })}
		>
			<Wrapper
				isCategory={isCategory}
				active={active}
				onMouseOver={() => setWrapperHovered(true)}
				onMouseOut={() => setWrapperHovered(false)}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<SidebarPill type={channel.unread ? "unread" : "none"} />
					{channel.channelIcon && !isCategory && (
						<Icon
							icon={channel.channelIcon}
							size="16px"
							style={{
								marginRight: "8px",
							}}
							color="var(--text-secondary)"
						/>
					)}
					{isCategory && (
						<Icon
							icon="mdiChevronDown"
							size="12px"
							color={wrapperHovered ? "var(--text)" : "var(--text-secondary)"}
							style={{
								marginRight: "8px",
							}}
						/>
					)}
					<Text isCategory={isCategory} hovered={wrapperHovered}>
						{channel.name}
					</Text>
				</div>
				{isCategory && hasCreateChannelPermission && (
					<Floating
						placement="top"
						type="tooltip"
						offset={10}
						props={{
							content: <span>Create Channel</span>,
						}}
					>
						<FloatingTrigger>
							<span
								onMouseOver={() => setCreateChannelHovered(true)}
								onMouseOut={() => setCreateChannelHovered(false)}
								onMouseDown={() => setChannelCreateDown(true)}
								onMouseUp={() => setChannelCreateDown(false)}
								onClick={() => {
									if (!channel.guild) {
										console.warn("No guild found for channel", channel);
										return;
									}

									modalController.push({
										type: "create_channel",
										guild: channel.guild,
										category: channel,
									});
								}}
							>
								<Icon
									icon="mdiPlus"
									size="18px"
									style={{
										marginLeft: "auto",
									}}
									color={
										createChannelDown
											? "var(--text-header)"
											: createChannelHovered
											? "var(--text)"
											: "var(--text-secondary)"
									}
								/>
							</span>
						</FloatingTrigger>
					</Floating>
				)}
			</Wrapper>
		</ListItem>
	);
}

export default observer(ChannelListItem);
