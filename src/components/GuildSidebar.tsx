import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import GuildItem from "./GuildItem";

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

const ListItem = styled.li`
	padding: 0;
	margin: 0;
`;

function GuildSidebar() {
	const app = useAppStore();

	return (
		<List>
			{app.guilds.getAll().map((guild) => (
				<ListItem key={guild.id}>
					<GuildItem guildId={guild.id} />
				</ListItem>
			))}
		</List>
	);
}

export default observer(GuildSidebar);
