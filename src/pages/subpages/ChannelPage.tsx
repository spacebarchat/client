import React from "react";
import styled from "styled-components";
import ChannelSidebar from "../../components/ChannelSidebar";
import Chat from "../../components/Chat";
import Container from "../../components/Container";
import ContextMenu from "../../components/ContextMenu";
import GuildSidebar from "../../components/GuildSidebar";
import MemberList from "../../components/MemberList";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";

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
	const contextMenu = React.useContext(ContextMenuContext);

	return (
		<Wrapper>
			{contextMenu.visible && <ContextMenu {...contextMenu} />}
			<GuildSidebar />
			<Test />
		</Wrapper>
	);
}

export default ChannelPage;
