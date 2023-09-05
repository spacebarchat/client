import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Banner from "../../components/Banner";
import ChannelSidebar from "../../components/ChannelSidebar";
import ContainerComponent from "../../components/Container";
import ContextMenu from "../../components/ContextMenu";
import GuildSidebar from "../../components/GuildSidebar";
import Chat from "../../components/messaging/Chat";
import { BannerContext } from "../../contexts/BannerContext";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { useAppStore } from "../../stores/AppStore";

const Container = styled(ContainerComponent)`
	display: flex;
	flex-direction: column;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	overflow: hidden;
`;

function ChannelPage() {
	const app = useAppStore();
	const contextMenu = React.useContext(ContextMenuContext);
	const bannerContext = React.useContext(BannerContext);

	const { guildId, channelId } = useParams<{
		guildId: string;
		channelId: string;
	}>();
	const guild = app.guilds.get(guildId!);
	const channel = guild?.channels.get(channelId!);

	return (
		<Container>
			<Banner />
			<Wrapper>
				{contextMenu.visible && <ContextMenu {...contextMenu} />}
				<GuildSidebar guildId={guildId!} />
				<ChannelSidebar channel={channel} guild={guild} channelId={channelId} guildId={guildId} />
				<Chat channel={channel} guild={guild} channelId={channelId} guildId={guildId} />
			</Wrapper>
		</Container>
	);
}

export default observer(ChannelPage);
