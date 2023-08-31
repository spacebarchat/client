import { useModals } from "@mattjennings/react-modal-stack";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ContextMenuContext } from "../contexts/ContextMenuContext";
import Channel from "../stores/objects/Channel";
import Guild from "../stores/objects/Guild";
import { IContextMenuItem } from "./ContextMenuItem";
import Icon from "./Icon";
import CreateInviteModal from "./modals/CreateInviteModal";

const ListItem = styled.li<{ isCategory?: boolean }>`
	padding: ${(props) => (props.isCategory ? "16px 8px 0 0" : "1px 8px 0 0")};
	cursor: pointer;
`;

const Wrapper = styled.div<{ isCategory?: boolean; active?: boolean }>`
	margin-left: ${(props) => (props.isCategory ? "0" : "8px")};
	height: ${(props) => (props.isCategory ? "28px" : "33px")};
	border-radius: 4px;
	align-items: center;
	display: flex;
	padding: 0 8px;
	background-color: ${(props) => (props.active ? "var(--background-primary-alt)" : "transparent")};

	&:hover {
		background-color: var(--background-primary-alt);
	}
`;

const Text = styled.span<{ isCategory?: boolean }>`
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	white-space: nowrap;
	color: var(--text-secondary);
`;

interface Props {
	guild: Guild;
	channel: Channel;
	isCategory: boolean;
	active: boolean;
}

function ChannelListItem({ guild, channel, isCategory, active }: Props) {
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
				openModal(CreateInviteModal, { guild_id: guild.id, channel_id: channel.id });
			},
		},
	]);

	return (
		<ListItem
			key={channel.id}
			isCategory={isCategory}
			onClick={() => {
				// prevent navigating to non-text channels
				if (!channel.isTextChannel) return;

				navigate(`/channels/${guild.id}/${channel.id}`);
			}}
			onContextMenu={(e) => {
				e.preventDefault();
				contextMenu.open({
					position: {
						x: e.pageX,
						y: e.pageY,
					},
					items: contextMenuItems,
				});
			}}
		>
			<Wrapper isCategory={isCategory} active={active}>
				{channel.channelIcon && (
					<Icon
						icon={channel.channelIcon}
						size="16px"
						style={{
							marginRight: "8px",
						}}
						color="var(--text-secondary)"
					/>
				)}
				<Text isCategory={isCategory}>{channel.name}</Text>
			</Wrapper>
		</ListItem>
	);
}

export default ChannelListItem;
