import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import React from "react";
import Container from "../../../components/Container";
import GuildSidebar from "../../../components/GuildSidebar/GuildSidebar";
import { ChannelsParamList, RootStackScreenProps } from "../../../types";
import ChannelScreen from "../ChannelScreen/ChannelScreen";
import Settings from "../Settings/Settings";

const Stack = createNativeStackNavigator<ChannelsParamList>();

function ChannelsScreen({ navigation }: RootStackScreenProps<"Channels">) {
	return (
		<Container verticalCenter horizontalCenter flexOne displayFlex row>
			<GuildSidebar />

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
					<Stack.Screen name="Settings" component={Settings} />
				</Stack.Navigator>
			</Container>
		</Container>
	);
}

export default observer(ChannelsScreen);
