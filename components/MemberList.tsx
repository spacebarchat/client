import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Platform, SectionList, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../constants/Colors";
import ChannelStore from "../stores/ChannelStore";
import { DomainContext } from "../stores/DomainStore";
import GuildStore from "../stores/GuildStore";
import Container from "./Container";

interface Props {
	guild: GuildStore;
	channel: ChannelStore;
}

const MemberList = observer(({ guild, channel }: Props) => {
	const theme = useTheme<CustomTheme>();
	const domain = React.useContext(DomainContext);

	useEffect(() => {
		domain.gateway.onChannelOpen(guild.id, channel.id);
	}, [guild]);

	if (!guild.memberList) return null;

	return (
		<SectionList
			sections={guild.memberList.listData || []}
			keyExtractor={(item, index) => index + item.user?.id!}
			renderItem={({ item }) => (
				<View>
					<Text>{item.user?.username}</Text>
				</View>
			)}
			renderSectionHeader={({ section: { title } }) => (
				<View
					style={{
						backgroundColor: Platform.isMobile
							? theme.colors.palette.backgroundPrimary100
							: theme.colors.palette.backgroundPrimary70,
						paddingTop: 10,
					}}
				>
					<Text
						style={{
							color: theme.colors.textMuted,
						}}
					>
						{title}
					</Text>
				</View>
			)}
			stickySectionHeadersEnabled={Platform.isMobile}
			contentContainerStyle={{ padding: 10 }}
		/>
	);
});

export default MemberList;
