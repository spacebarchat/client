import { useModals } from "@mattjennings/react-modal-stack";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import Channel from "../../stores/objects/Channel";
import { IContextMenuItem } from "../ContextMenuItem";
import Icon from "../Icon";
import Tooltip from "../Tooltip";
import CreateInviteModal from "../modals/CreateInviteModal";

const ListItem = styled.div<{ isCategory?: boolean }>`
	padding: ${(props) => (props.isCategory ? "16px 8px 0 0" : "1px 8px 0 0")};
	cursor: ${(props) => (props.isCategory ? "not-allowed" : "pointer")};
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
	const navigate = useNavigate();

	const { openModal } = useModals();

	const contextMenu = React.useContext(ContextMenuContext);
	const [contextMenuItems, setContextMenuItems] = React.useState<IContextMenuItem[]>([
		{
			index: 1,
			label: "Copy Channel ID",
			onClick: () => {
				navigator.clipboard.writeText(channel.id);
			},
			iconProps: {
				icon: "mdiIdentifier",
			},
		},
		{
			index: 0,
			label: "Create Channel Invite",
			onClick: () => {
				openModal(CreateInviteModal, { guild_id: channel.guildId!, channel_id: channel.id });
			},
			iconProps: {
				icon: "mdiAccountPlus",
			},
		},
	]);
	const [hovered, setHovered] = React.useState(false);

	return (
		<ListItem
			key={channel.id}
			isCategory={isCategory}
			onClick={() => {
				// prevent navigating to non-text channels
				if (!channel.isTextChannel) return;

				navigate(`/channels/${channel.guildId}/${channel.id}`);
			}}
			onContextMenu={(e) => contextMenu.open2(e, contextMenuItems)}
		>
			<Wrapper
				isCategory={isCategory}
				active={active}
				onMouseOver={() => setHovered(true)}
				onMouseOut={() => setHovered(false)}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
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
							color={hovered ? "var(--text)" : "var(--text-secondary)"}
							style={{
								marginRight: "8px",
							}}
						/>
					)}
					<Text isCategory={isCategory} hovered={hovered}>
						{channel.name}
					</Text>
				</div>
				{isCategory && (
					<Tooltip title="Create Channel" placement="top">
						<span>
							<Icon
								icon="mdiPlus"
								size="18px"
								style={{
									marginLeft: "auto",
								}}
								color={hovered ? "var(--text)" : "var(--text-secondary)"}
							/>
						</span>
					</Tooltip>
				)}
			</Wrapper>
		</ListItem>
	);
}

export default ChannelListItem;
