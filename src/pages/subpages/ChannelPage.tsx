import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ChannelList from "../../components/ChannelList";
import Chat from "../../components/Chat";
import Container from "../../components/Container";
import GuildSidebar from "../../components/GuildSidebar";
import MemberList from "../../components/MemberList";

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: row;
`;

function Test() {
	return (
		<>
			<ChannelList />
			<Chat />
			<MemberList />
		</>
	);
}

function ChannelPage() {
	return (
		<Wrapper>
			<GuildSidebar />
			<Test />
		</Wrapper>
	);
}

export default observer(ChannelPage);
