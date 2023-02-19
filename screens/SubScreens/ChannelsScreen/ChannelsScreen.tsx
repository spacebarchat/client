import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, ScrollView } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import Container from "../../../components/Container";
import GuildListGuildItem from "../../../components/GuildListGuildItem";
import { CustomTheme } from "../../../constants/Colors";
import { DomainContext } from "../../../stores/DomainStore";
import { ChannelsParamList, RootStackScreenProps } from "../../../types";
import ChannelScreen from "../ChannelScreen/ChannelScreen";

const Stack = createNativeStackNavigator<ChannelsParamList>();

function ChannelsScreen({ navigation }: RootStackScreenProps<"Channels">) {
	const domain = React.useContext(DomainContext);
	const theme = useTheme<CustomTheme>();

	return (
		<Container verticalCenter horizontalCenter flexOne displayFlex row>
			<Container
				testID="guildsList"
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

			<Container
				testID="outerContainer"
				style={{ height: "100%" }}
				displayFlex
				flexOne
				row
			>
				<Stack.Navigator
					initialRouteName="Channel"
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen
						name="Channel"
						component={ChannelScreen}
						initialParams={{ guildId: "me" }}
					/>
				</Stack.Navigator>
			</Container>
		</Container>
	);
}

export default ChannelsScreen;
