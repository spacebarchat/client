import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import Container from "./Container";

const Wrapper = styled(Container)`
	display: flex;
	flex: 1 1 auto;
	background-color: var(--background-secondary);
`;

const List = styled.ul`
	list-style: none;
	padding: 0;
	display: flex;
	flex-direction: column;
`;

function EmptyChannelList() {
	return (
		<Wrapper>
			<span>skeleton</span>
		</Wrapper>
	);
}

function ChannelList() {
	const app = useAppStore();
	const { guildId, channelId } = useParams<{
		guildId: string;
		channelId: string;
	}>();
	if (!guildId) return <EmptyChannelList />;
	const guild = app.guilds.get(guildId);
	if (!guild) return <EmptyChannelList />;

	return (
		<Wrapper>
			<List>
				{guild.channels.getAll().map((channel) => {
					return <li key={channel.id}>{channel.name}</li>;
				})}
			</List>
		</Wrapper>
	);
}

export default ChannelList;
