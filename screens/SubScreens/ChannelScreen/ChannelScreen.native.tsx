import { observer } from "mobx-react";
import React from "react";
import { Text, useTheme } from "react-native-paper";
import ChannelHeader from "../../../components/ChannelHeader";
import ChannelSidebar from "../../../components/ChannelSidebar/ChannelSidebar";
import Container from "../../../components/Container";
import GuildSidebar from "../../../components/GuildSidebar/GuildSidebar";
import MemberList from "../../../components/MemberList/MemberList";
import MessageList from "../../../components/MessageList";
import Swiper from "../../../components/Swiper";
import { CustomTheme } from "../../../constants/Colors";
import useChannel from "../../../hooks/useChannel";
import useGuild from "../../../hooks/useGuild";
import { DomainContext } from "../../../stores/DomainStore";
import { ChannelsStackScreenProps } from "../../../types";

function ChannelScreen(props: ChannelsStackScreenProps<"Channel">) {
	let { guildId, channelId } = props.route.params;

	const theme = useTheme<CustomTheme>();
	const domain = React.useContext(DomainContext);
	const guild = useGuild(guildId, domain);
	const channel = useChannel(guildId, channelId, domain);

	/**
   Constructs the Guild Sidebar and Channel list for the left side of the Swipper component
   */
	const leftAction = (
		<Container flexOne row>
			<GuildSidebar />
			<ChannelSidebar guild={guild} />
		</Container>
	);

	/**
	 * Constructs the Member list component for the right side of the swiper
	 */
	const rightAction =
		guild && channel ? (
			<MemberList guild={guild} channel={channel} />
		) : null;

	return (
		<Swiper
			leftChildren={leftAction}
			rightChildren={rightAction}
			containerStyle={{
				backgroundColor: theme.colors.palette.backgroundPrimary40,
			}}
		>
			<Container
				flexOne
				style={{
					backgroundColor: theme.colors.palette.backgroundPrimary90,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
				}}
			>
				{!guild || !channel ? (
					<Text>AAAA</Text>
				) : (
					<>
						<ChannelHeader channel={channel} />
						<MessageList guild={guild} channel={channel} />
					</>
				)}
			</Container>
		</Swiper>
	);
}

export default observer(ChannelScreen);
