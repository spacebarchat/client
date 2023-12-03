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
import PopoutRenderer from "../../components/PopoutRenderer";
import Chat from "../../components/messaging/Chat";
import { BannerContext } from "../../contexts/BannerContext";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { PopoutContext } from "../../contexts/PopoutContext";
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
	const contextMenuContext = React.useContext(ContextMenuContext);
	const popoutContext = React.useContext(PopoutContext);
	const bannerContext = React.useContext(BannerContext);

	const { guildId, channelId } = useParams<{ guildId: string; channelId: string }>();

	React.useEffect(() => {
		app.setActiveGuildId(guildId);
		app.setActiveChannelId(channelId);
	}, [guildId, channelId]);

	return (
		<Container>
			<Banner />
			<Wrapper>
				{contextMenuContext.visible && <ContextMenu {...contextMenuContext} />}
				{popoutContext.element && <PopoutRenderer {...popoutContext} />}
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
