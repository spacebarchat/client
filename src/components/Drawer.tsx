import React from "react";
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./Routes";
import Test from "../pages/Test";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();

function DrawerButton(props: any) {
	return (
		<DrawerContentScrollView {...props}>
			<DrawerItemList {...props} />
			<DrawerItem
				label="Ausloggen"
				onPress={() => {
					AsyncStorage.removeItem("accessToken");
					//TODO: Reload
				}}
			/>
		</DrawerContentScrollView>
	);
}

export default ({ children }: any) => {
	return (
		<NavigationContainer>
			<Drawer.Navigator
				initialRouteName="Home"
				drawerContent={(props) => <DrawerButton {...props} />}
			>
				<Drawer.Screen name="Home" component={Test} />
				{/* //TODO: Acces Token zum ausloggen löschen */}
				{/* <Drawer.Screen name="Ausloggen" /> */}
				{/* <Drawer.Screen name="Notifications" component={NotificationsScreen} /> */}
			</Drawer.Navigator>
		</NavigationContainer>
	);
};
