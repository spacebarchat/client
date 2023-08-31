import React from "react";
import styled from "styled-components";
import ChannelSidebar from "../../components/ChannelSidebar";
import Container from "../../components/Container";
import ContextMenu from "../../components/ContextMenu";
import GuildSidebar from "../../components/GuildSidebar";
import MemberList from "../../components/MemberList";
import Chat from "../../components/messaging/Chat";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: row;
`;

function ChannelPage() {
	const contextMenu = React.useContext(ContextMenuContext);

	return (
		<Wrapper>
			{contextMenu.visible && <ContextMenu {...contextMenu} />}
			<GuildSidebar />
			<ChannelSidebar />
			<Chat />
			<MemberList />
		</Wrapper>
	);
}

export default ChannelPage;
