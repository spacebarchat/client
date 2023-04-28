import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import Guild from "./Guild";
import SidebarAction from "./SidebarAction";

const List = styled.ul`
	list-style: none;
	padding: 12px;
	margin: 0;
	display: flex;
	flex-direction: column;
	flex: 0 0 48px;
	align-items: center;

	@media (max-width: 1080px) {
		display: none;
	}
`;

const Hr = styled.hr`
	width: 100%;
	margin-top: 12px;
`;

function GuildSidebar() {
	const app = useAppStore();
	const navigate = useNavigate();

	return (
		<List>
			<SidebarAction
				key="home"
				tooltip="Home"
				icon={{
					iconName: "MdHome",
				}}
				action={() => navigate("/channels/@me")}
				margin={false}
			/>
			<Hr key="hr" />
			{app.guilds.getAll().map((guild) => (
				<Guild key={guild.id} guildId={guild.id} />
			))}
		</List>
	);
}

export default observer(GuildSidebar);
