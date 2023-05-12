import styled from "styled-components";
import ChannelSidebar from "../../components/ChannelSidebar";
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
			<ChannelSidebar />
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

export default ChannelPage;
