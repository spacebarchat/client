import { CDNRoutes, ChannelType, ImageFormat } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ContextMenuContext } from "../contexts/ContextMenuContext";
import useLogger from "../hooks/useLogger";
import { useAppStore } from "../stores/AppStore";
import Guild from "../stores/objects/Guild";
import { Permissions } from "../utils/Permissions";
import REST from "../utils/REST";
import Container from "./Container";
import SidebarPill, { PillType } from "./SidebarPill";
import Floating from "./floating/Floating";
import FloatingTrigger from "./floating/FloatingTrigger";

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
	const contextMenu = useContext(ContextMenuContext);

	const [pillType, setPillType] = React.useState<PillType>("none");
	const [isHovered, setHovered] = React.useState(false);

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
		<GuildSidebarListItem
			ref={contextMenu.setReferenceElement}
			onContextMenu={(e) => contextMenu.onContextMenu(e, { type: "guild", guild })}
		>
			<SidebarPill type={pillType} />
			<Floating
				placement="right"
				type="tooltip"
				offset={20}
				props={{
					content: <span>{guild.name}</span>,
				}}
			>
				<FloatingTrigger>
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
				</FloatingTrigger>
			</Floating>
		</GuildSidebarListItem>
	);
}

export default observer(GuildItem);
