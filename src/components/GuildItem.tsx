import {
	CDNRoutes,
	ChannelType,
	ImageFormat,
} from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import REST from "../utils/REST";
import Container from "./Container";
import GuildSidebarListItem from "./GuildSidebarListItem";
import SidebarPill, { PillType } from "./SidebarPill";
import Tooltip from "./Tooltip";

const Wrapper = styled(Container)<{ active?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48px;
	height: 48px;
	border-radius: ${(props) => (props.active ? "30%" : "50%")};
	background-color: ${(props) =>
		props.active ? "var(--primary)" : "var(--background-secondary)"};
	transition: border-radius 0.2s ease, background-color 0.2s ease;
	cursor: pointer;

	&:hover {
		border-radius: 30%;
		background-color: var(--primary);
	}
`;

interface Props {
	guildId: string;
	active?: boolean;
}

/**
 * List item for use in the guild sidebar
 */
function GuildItem(props: Props) {
	const app = useAppStore();
	const navigate = useNavigate();
	const guild = app.guilds.get(props.guildId);
	const [pillType, setPillType] = React.useState<PillType>("none");
	const [isHovered, setHovered] = React.useState(false);

	if (!guild) return null;

	const doNavigate = () => {
		const channel = guild.channels.mapped.find(
			(x) => x.type !== ChannelType.GuildCategory,
		);
		navigate(
			`/channels/${props.guildId}${channel ? `/${channel.id}` : ""}`,
		);
	};

	React.useEffect(() => {
		if (props.active) return setPillType("active");
		else if (isHovered) return setPillType("hover");
		// TODO: unread
		else return setPillType("none");
	}, [props.active, isHovered]);

	return (
		<GuildSidebarListItem>
			<SidebarPill type={pillType} />
			<Tooltip title={guild.name} placement="right">
				<Wrapper
					onClick={doNavigate}
					active={props.active}
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
				>
					{guild.icon ? (
						<img
							src={REST.makeCDNUrl(
								CDNRoutes.guildIcon(
									props.guildId,
									guild?.icon,
									ImageFormat.PNG,
								),
							)}
							width={48}
							height={48}
						/>
					) : (
						<span style={{ fontSize: "18px", fontWeight: "bold", cursor: "pointer" }}>
							{guild?.acronym}
						</span>
					)}
				</Wrapper>
			</Tooltip>
		</GuildSidebarListItem>
	);
}

export default GuildItem;
