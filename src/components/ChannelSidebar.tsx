import styled from "styled-components";
import ChannelHeader from "./ChannelHeader";
import ChannelList from "./ChannelList";
import Container from "./Container";

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
	// const app = useAppStore();
	// const { guildId, channelId } = useParams<{
	// 	guildId: string;
	// 	channelId: string;
	// }>();
	// if (!guildId) return <EmptyChannelList />;
	// const guild = app.guilds.get(guildId);
	// if (!guild) return <EmptyChannelList />;

	return (
		<Wrapper>
			<ChannelHeader />
			<ChannelList />
		</Wrapper>
	);
}

export default ChannelSidebar;
