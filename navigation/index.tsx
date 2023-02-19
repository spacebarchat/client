/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import * as React from "react";
import { Platform } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import MobileRoot from "../screens/MobileRoot";
import NotFoundScreen from "../screens/NotFoundScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ChannelsScreen from "../screens/SubScreens/ChannelsScreen/ChannelsScreen";
import TempSettingsScreen from "../screens/TempSettingsScreen";
import ThemeOverview from "../screens/ThemeOverview";
import { DomainContext } from "../stores/DomainStore";
import { RootStackParamsList } from "../types";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamsList>();

export const RootNavigator = observer(() => {
	const domain = React.useContext(DomainContext);

	const commonStack = (
		<>
			<Stack.Screen name="ThemeOverview" component={ThemeOverview} />
			<Stack.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: "Oops!" }}
			/>
		</>
	);

	const authenticatedStack = (
		<>
			<Stack.Screen
				name="Channels"
				component={ChannelsScreen}
				initialParams={{ params: { guildId: "me" } }}
			/>
		</>
	);

	const unauthenticatedStack = (
		<>
			{Platform.isMobile && (
				<Stack.Screen name="App" component={MobileRoot} />
			)}
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
			<Stack.Screen name="Settings" component={TempSettingsScreen} />
		</>
	);

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{domain.account.isAuthenticated
				? authenticatedStack
				: unauthenticatedStack}
			{commonStack}
		</Stack.Navigator>
	);
});
