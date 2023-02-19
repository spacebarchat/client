import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { observer } from "mobx-react";
import React from "react";
import { Animated } from "react-native";
import { useTheme } from "react-native-paper";
import BottomTabBar from "../../../components/ReactNavigationBottomTabs/views/BottomTabBar";
import { CustomTheme } from "../../../constants/Colors";
import BottomTabBarProgressContext from "../../../contexts/BottomTabBarProgressContext";
import { ChannelsParamList } from "../../../types";
import ChannelScreen from "../ChannelScreen/ChannelScreen";
import Settings from "../Settings/Settings";

const Tab = createBottomTabNavigator<ChannelsParamList>();

function ChannelsScreen() {
	const theme = useTheme<CustomTheme>();

	return (
		<BottomTabBarProgressContext.Provider
			value={{
				progress: new Animated.Value(0),
				setProgress: (progress: number) => {},
			}}
		>
			<Tab.Navigator
				initialRouteName="Channel"
				screenOptions={{
					headerShown: false,
					// tabBarActiveBackgroundColor: theme.colors.primary,
					tabBarStyle: {
						backgroundColor:
							theme.colors.palette.backgroundPrimary0,
					},
					tabBarShowLabel: false,
				}}
				tabBar={(props) => <BottomTabBar {...props} />}
			>
				<Tab.Screen
					name="Channel"
					component={ChannelScreen}
					initialParams={{ guildId: "me" }}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="chat"
								color={color}
								size={size}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="Settings"
					component={Settings}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="cog"
								color={color}
								size={size}
							/>
						),
					}}
				/>
			</Tab.Navigator>
		</BottomTabBarProgressContext.Provider>
	);
}

export default observer(ChannelsScreen);
