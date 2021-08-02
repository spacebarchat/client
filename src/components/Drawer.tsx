import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { Box, HamburgerIcon, Text } from "native-base";
import { Dimensions } from "react-native";
import KitchenSink from "../pages/DesignEditor/KitchenSink";

// AsyncStorage.removeItem("accessToken");

export default ({ children }: any) => {
	const width = Dimensions.get("window").width * 0.75;

	return (
		<DrawerLayout
			drawerWidth={width}
			edgeWidth={200}
			overlayColor="transparent"
			// @ts-ignore
			drawerPosition={DrawerLayout.positions.Right}
			drawerType="slide"
			renderNavigationView={() => (
				<Box style={{ borderColor: "white", borderWidth: 1, height: "100%" }}>
					<Text>right drawer content</Text>
				</Box>
			)}
		>
			<DrawerLayout
				overlayColor="transparent"
				edgeWidth={200}
				drawerWidth={width}
				// @ts-ignore
				drawerPosition={DrawerLayout.positions.Left}
				drawerType="slide"
				renderNavigationView={() => (
					<Box style={{ borderColor: "white", borderWidth: 1, height: "100%" }}>
						<Text>left drawer content</Text>
					</Box>
				)}
			>
				<Box style={{ borderColor: "white", borderWidth: 1, height: "100%" }}>
					<HamburgerIcon />
				</Box>
			</DrawerLayout>
		</DrawerLayout>
	);
};
