import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ChannelSidebar from "../../components/ChannelSidebar";
import Container from "../../components/Container";
import ContextMenu from "../../components/ContextMenu";
import GuildSidebar from "../../components/GuildSidebar";
import MemberList from "../../components/MemberList";
import Chat from "../../components/messaging/Chat";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { useAppStore } from "../../stores/AppStore";

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: row;
`;

function ChannelPage() {
	const app = useAppStore();
	const contextMenu = React.useContext(ContextMenuContext);

	const { guildId, channelId } = useParams<{
		guildId: string;
		channelId: string;
	}>();
	const guild = app.guilds.get(guildId!);
	const channel = guild?.channels.get(channelId!);

	return (
		<Wrapper>
			{contextMenu.visible && <ContextMenu {...contextMenu} />}
			<GuildSidebar guildId={guildId!} />
			<ChannelSidebar channel={channel} guild={guild} channelId={channelId} guildId={guildId} />
			<Chat channel={channel} guild={guild} />
			<MemberList />
		</Wrapper>
	);
}

export default observer(ChannelPage);
