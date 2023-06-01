import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import GuildItem from "./GuildItem";
import GuildSidebarListItem from "./GuildSidebarListItem";
import SidebarAction from "./SidebarAction";
import AddServerModal from "./modals/AddServerModal";
import { useModals } from "@mattjennings/react-modal-stack";

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
	background-color: white;
`;

function GuildSidebar() {
	const app = useAppStore();
	const { openModal } = useModals();
	const navigate = useNavigate();
	const { guildId } = useParams<{ guildId: string; channelId: string }>();

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
				{app.guilds.getAll().map((guild) => (
					<GuildItem
						key={guild.id}
						guildId={guild.id}
						active={guild.id === guildId}
					/>
				))}
			</div>

			{/* // TODO: green coloring */}
			<SidebarAction
				key="add-server"
				tooltip="Add Server"
				icon={{
					icon: "mdiPlus",
					size: "24px",
				}}
				action={() => {
					openModal(AddServerModal);
				}}
				margin={false}
			/>
		</List>
	);
}

export default observer(GuildSidebar);
