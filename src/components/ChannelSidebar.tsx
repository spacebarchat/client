import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import ChannelHeader from "./ChannelHeader";
import ChannelList from "./ChannelList";
import Container from "./Container";
import UserPanel from "./UserPanel";

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: column;
	flex: 0 0 240px;
	background-color: var(--background-secondary);

	@media (max-width: 1080px) {
		display: none;
	}
`;

function ChannelSidebar() {
	const app = useAppStore();
	const { guildId, channelId } = useParams<{
		guildId: string;
		channelId: string;
	}>();
	const guild = guildId ? app.guilds.get(guildId) : undefined;

	return (
		<Wrapper>
			{/* // TODO: replace with dm search if no guild */}
			<ChannelHeader text={guild?.name ?? "Channel Header"} />
			<ChannelList />
			<UserPanel />
		</Wrapper>
	);
}

export default ChannelSidebar;
