import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { Box, Text } from "native-base";

// AsyncStorage.removeItem("accessToken");

export default ({ children }: any) => {
	return (
		<DrawerLayout
			drawerWidth={300}
			edgeWidth={200}
			overlayColor="transparent"
			// @ts-ignore
			drawerPosition={DrawerLayout.positions.Right}
			drawerType="slide"
			drawerBackgroundColor="#ddd"
			renderNavigationView={() => (
				<Box>
					<Text>I am in the drawer!</Text>
				</Box>
			)}
			onDrawerSlide={(status) => console.log(status)}
		>
			<DrawerLayout
				overlayColor="transparent"
				edgeWidth={200}
				drawerWidth={300}
				// @ts-ignore
				drawerPosition={DrawerLayout.positions.Left}
				drawerType="slide"
				drawerBackgroundColor="#ddd"
				renderNavigationView={() => (
					<Box>
						<Text>I am in the drawer!</Text>
					</Box>
				)}
				onDrawerSlide={(status) => console.log(status)}
			>
				<Text>Hello, it's second</Text>
			</DrawerLayout>
		</DrawerLayout>
	);
};
