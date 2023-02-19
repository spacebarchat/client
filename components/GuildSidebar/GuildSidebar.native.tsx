import { CommonActions, useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import React, { useContext } from "react";
import { Pressable, ScrollView } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { CustomTheme } from "../../constants/Colors";
import { DomainContext } from "../../stores/DomainStore";
import Container from "../Container";
import GuildListGuild from "../GuildListGuildItem";

function GuildSidebar() {
	const navigation = useNavigation();
	const domain = useContext(DomainContext);
	const theme = useTheme<CustomTheme>();

	return (
		<Container
			testID="guildSidebarContainer"
			style={{
				width: 72,
				backgroundColor: theme.colors.palette.backgroundPrimary40,
			}}
		>
			<ScrollView testID="guildSidebarList">
				<Pressable
					testID="guildSidebarListItemActionHome"
					onPress={() => {
						navigation.dispatch(
							CommonActions.navigate("Channels", {
								screen: "Channel",
								params: { guildId: "me" },
							}),
						);
					}}
				>
					<Avatar.Icon icon="home" size={48} />
				</Pressable>

				<Container testID="guildSidebarListGuildsContainer">
					{domain.guilds.asList().map((guild) => {
						return (
							<GuildListGuild
								key={guild.id}
								guild={guild}
								onPress={() => {
									navigation.dispatch(
										CommonActions.navigate("Channels", {
											screen: "Channel",
											params: { guildId: guild.id },
										}),
									);
								}}
							/>
						);
					})}
				</Container>
			</ScrollView>
		</Container>
	);
}

export default observer(GuildSidebar);
