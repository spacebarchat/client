import { observer } from "mobx-react-lite";
import styled from "styled-components";
import Channel from "../stores/objects/Channel";
import Guild from "../stores/objects/Guild";
import ChannelHeader from "./ChannelHeader";
import ChannelList, { EmptyChannelList } from "./ChannelList";
import Container from "./Container";
import UserPanel from "./UserPanel";

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: column;
	flex: 0 0 240px;
	background-color: var(--background-secondary);

	@media (max-width: 810px) {
		display: none;
	}
`;

interface Props {
	channel?: Channel;
	guild?: Guild;
	guildId?: string;
	channelId?: string;
}

function ChannelSidebar({ guild, channelId, guildId }: Props) {
	return (
		<Wrapper>
			{/* TODO: replace with dm search if no guild */}
			<ChannelHeader guild={guild} guildId={guildId} />
			{guild ? <ChannelList channelId={channelId} guild={guild} /> : <EmptyChannelList />}
			<UserPanel />
		</Wrapper>
	);
}

export default observer(ChannelSidebar);
