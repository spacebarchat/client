/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import LoginScreen from "../screens/LoginScreen";

import NotFoundScreen from "../screens/NotFoundScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RootScreen from "../screens/RootScreen";
import ThemeOverview from "../screens/ThemeOverview";
import { RootStackParamList } from "../types";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="App"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="App" component={RootScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ThemeOverview" component={ThemeOverview} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
