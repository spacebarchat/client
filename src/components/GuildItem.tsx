import { CDNRoutes, ChannelType, ImageFormat } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ContextMenuContext } from "../contexts/ContextMenuContext";
import { modalController } from "../controllers/modals/ModalController";
import useLogger from "../hooks/useLogger";
import { useAppStore } from "../stores/AppStore";
import Guild from "../stores/objects/Guild";
import { Permissions } from "../utils/Permissions";
import REST from "../utils/REST";
import Container from "./Container";
import { IContextMenuItem } from "./ContextMenuItem";
import SidebarPill, { PillType } from "./SidebarPill";
import Tooltip from "./Tooltip";

export const GuildSidebarListItem = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	cursor: pointer;
`;

const Wrapper = styled(Container)<{ active?: boolean; hasImage?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	border-radius: ${(props) => (props.active ? "30%" : "50%")};
	background-color: ${(props) =>
		props.hasImage ? "transparent" : props.active ? "var(--primary)" : "var(--background-secondary)"};
	transition: border-radius 0.2s ease, background-color 0.2s ease;

	&:hover {
		border-radius: 30%;
		background-color: ${(props) => (props.hasImage ? "transparent" : "var(--primary)")};
	}
`;

interface Props {
	guild: Guild;
	active?: boolean;
}

/**
 * List item for use in the guild sidebar
 */
function GuildItem({ guild, active }: Props) {
	const logger = useLogger("GuildItem");
	const app = useAppStore();
	const navigate = useNavigate();

	const [pillType, setPillType] = React.useState<PillType>("none");
	const [isHovered, setHovered] = React.useState(false);

	const contextMenu = React.useContext(ContextMenuContext);
	const [contextMenuItems, setContextMenuItems] = React.useState<IContextMenuItem[]>([
		{
			index: 1,
			label: "Copy Guild ID",
			onClick: () => {
				navigator.clipboard.writeText(guild.id);
			},
			iconProps: {
				icon: "mdiIdentifier",
			},
		},
		{
			index: 0,
			label: "Create Invite",
			onClick: () => {
				// get first channel with view permissions in guild
				const channel = guild.channels.find((x) => {
					const permission = Permissions.getPermission(app.account!.id, guild, x);
					return permission.has("VIEW_CHANNEL") && x.type !== ChannelType.GuildCategory;
				});
				if (!channel) return logger.error("No suitable channel found for invite creation");

				modalController.push({
					type: "create_invite",
					target: channel,
				});
			},
			iconProps: {
				icon: "mdiAccountPlus",
			},
		},
	]);

	React.useEffect(() => {
		if (app.activeChannelId && app.activeGuildId === guild.id) return setPillType("active");
		else if (isHovered) return setPillType("hover");
		// TODO: unread
		else return setPillType("none");
	}, [app.activeGuildId, isHovered]);

	const doNavigate = () => {
		const channel = guild.channels.find((x) => {
			const permission = Permissions.getPermission(app.account!.id, guild, x);
			return permission.has("VIEW_CHANNEL") && x.type !== ChannelType.GuildCategory;
		});
		navigate(`/channels/${guild.id}${channel ? `/${channel.id}` : ""}`);
	};

	return (
		<GuildSidebarListItem onContextMenu={(e) => contextMenu.open2(e, contextMenuItems)}>
			<SidebarPill type={pillType} />
			<Tooltip title={guild.name} placement="right">
				<Wrapper
					onClick={doNavigate}
					active={active}
					hasImage={!!guild?.icon}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
				>
					{guild.icon ? (
						<img
							src={REST.makeCDNUrl(CDNRoutes.guildIcon(guild.id, guild?.icon, ImageFormat.PNG))}
							width={48}
							height={48}
							loading="lazy"
						/>
					) : (
						<span
							style={{
								fontSize: "18px",
								fontWeight: "bold",
								cursor: "pointer",
							}}
						>
							{guild?.acronym}
						</span>
					)}
				</Wrapper>
			</Tooltip>
		</GuildSidebarListItem>
	);
}

export default observer(GuildItem);
