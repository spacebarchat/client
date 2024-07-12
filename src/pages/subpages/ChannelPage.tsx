import { observer } from "mobx-react-lite";
import React from "react";
import { isMobile } from "react-device-detect";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ChannelSidebar from "../../components/ChannelSidebar";
import ContainerComponent from "../../components/Container";
import ErrorBoundary from "../../components/ErrorBoundary";
import GuildSidebar from "../../components/GuildSidebar";
import SwipeableLayout from "../../components/SwipeableLayout";
import Chat from "../../components/messaging/Chat";
import BannerRenderer from "../../controllers/banners/BannerRenderer";
import { useAppStore } from "../../stores/AppStore";

const Container = styled(ContainerComponent)`
	display: flex;
	flex: 1;
	flex-direction: column;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	overflow: hidden;
`;

function LeftPanel() {
	return (
		<div
			style={{
				display: "flex",
				flex: 1,
			}}
		>
			<GuildSidebar />
			<ChannelSidebar />
		</div>
	);
}

function RightPanel() {
	return <div style={{ height: "100%", backgroundColor: "green", color: "white" }}>Right Panel</div>;
}

function ChannelPage() {
	const app = useAppStore();

	const { guildId, channelId } = useParams<{ guildId: string; channelId: string }>();

	React.useEffect(() => {
		app.setActiveGuildId(guildId);
		app.setActiveChannelId(channelId);
	}, [guildId, channelId]);

	if (isMobile) {
		return (
			<Container>
				<BannerRenderer />
				<SwipeableLayout leftChildren={<LeftPanel />} rightChildren={<RightPanel />}>
					<ErrorBoundary section="component">
						<Chat />
					</ErrorBoundary>
				</SwipeableLayout>
			</Container>
		);
	}

	return (
		<Container>
			<BannerRenderer />
			<Wrapper>
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
