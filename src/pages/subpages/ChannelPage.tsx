import { observer } from "mobx-react-lite";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Banner from "../../components/Banner";
import ChannelSidebar from "../../components/ChannelSidebar";
import ContainerComponent from "../../components/Container";
import ContextMenu from "../../components/ContextMenu";
import ErrorBoundary from "../../components/ErrorBoundary";
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

	const { guildId, channelId } = useParams<{ guildId: string; channelId: string }>();

	React.useEffect(() => {
		console.log(guildId, channelId);
		if (guildId && channelId) {
			app.setActiveGuildId(guildId);
			app.setActiveChannelId(channelId);
		}
	}, [guildId, channelId]);

	return (
		<Container>
			<Banner />
			<Wrapper>
				{contextMenu.visible && <ContextMenu {...contextMenu} />}
				<GuildSidebar />
				<ChannelSidebar />
				<ErrorBoundary section="component">
					<Chat />
				</ErrorBoundary>
			</Wrapper>
		</Container>
	);
}

export default observer(ChannelPage);
