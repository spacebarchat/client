import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { Pressable, ScrollView } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { CustomTheme } from "../../constants/Colors";
import { DomainContext } from "../../stores/DomainStore";
import Container from "../Container";
import GuildListGuildItem from "../GuildListGuildItem";

function GuildSidebar() {
	const navigation = useNavigation();
	const domain = React.useContext(DomainContext);
	const theme = useTheme<CustomTheme>();

	return (
		<Container
			testID="guildSidebarContainer"
			style={{
				height: "100%",
				backgroundColor: theme.colors.palette.backgroundPrimary40,
				width: 72,
				zIndex: 3,
			}}
			displayFlex
			horizontalCenter
		>
			<ScrollView style={{ overflow: "visible" }}>
				<Pressable
					onPress={() => {
						navigation.navigate("Channels", {
							screen: "Channel",
							params: { guildId: "me" },
						});
					}}
				>
					<Avatar.Icon icon="home" size={48} />
				</Pressable>

				<Container
					testID="guildListGuildIconContainer"
					style={{ overflow: "visible" }}
				>
					{domain.guilds.asList().map((guild) => {
						return (
							<GuildListGuildItem
								key={guild.id}
								guild={guild}
								onPress={() => {
									navigation.navigate("Channels", {
										screen: "Channel",
										params: { guildId: guild.id },
									});
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
