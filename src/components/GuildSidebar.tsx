import { useModals } from "@mattjennings/react-modal-stack";
import { observer } from "mobx-react-lite";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import Guild from "../stores/objects/Guild";
import GuildItem from "./GuildItem";
import GuildSidebarListItem from "./GuildSidebarListItem";
import SidebarAction from "./SidebarAction";
import AddServerModal from "./modals/AddServerModal";

const List = styled.ul`
	list-style: none;
	padding: 0;
	display: flex;
	flex-direction: column;
	flex: 0 0 48px;
	align-items: center;

	@media (max-width: 1080px) {
		display: none;
	}
`;

const Divider = styled.div`
	height: 2px;
	width: 32px;
	border-radius: 1px;
	background-color: var(--text-disabled);
`;

interface Props {
	guildId: string;
}

function GuildSidebar({ guildId }: Props) {
	const app = useAppStore();
	const { openModal } = useModals();
	const navigate = useNavigate();

	const renderGuildItem = React.useCallback((guild: Guild, active: boolean) => {
		return <GuildItem key={guild.id} guild={guild} active={active} />;
	}, []);

	return (
		<List>
			<SidebarAction
				key="home"
				tooltip="Home"
				icon={{
					icon: "mdiHome",
					size: "24px",
				}}
				action={() => navigate("/channels/@me")}
				margin={false}
				active={guildId === "@me"}
			/>
			<GuildSidebarListItem>
				<Divider key="divider" />
			</GuildSidebarListItem>
			<div aria-label="Servers">
				{app.guilds.getAll().map((guild) => renderGuildItem(guild, guild.id === guildId))}
			</div>

			<SidebarAction
				key="add-server"
				tooltip="Add Server"
				icon={{
					icon: "mdiPlus",
					size: "24px",
					color: "var(--success)",
				}}
				action={() => {
					openModal(AddServerModal);
				}}
				margin={false}
				disablePill
				useGreenColorScheme
			/>
		</List>
	);
}

export default observer(GuildSidebar);
