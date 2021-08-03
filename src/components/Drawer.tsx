import React, { useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { Box, Button, HamburgerIcon, HStack, Icon, IconButton, Text, VStack } from "native-base";
import { useWindowDimensions } from "react-native";
import DevSettings from "./DevSettings";

export default () => {
	const width = useWindowDimensions().width * 0.75;
	const drawer = useRef(null);

	return (
		<DrawerLayout
			drawerWidth={width}
			edgeWidth={200}
			overlayColor="transparent"
			// @ts-ignore
			drawerPosition={DrawerLayout.positions.Right}
			drawerType="slide"
			renderNavigationView={() => (
				<Box>
					<Text>right drawer content</Text>
				</Box>
			)}
		>
			<DrawerLayout
				ref={drawer}
				overlayColor="transparent"
				edgeWidth={200}
				drawerWidth={width}
				// @ts-ignore
				drawerPosition={DrawerLayout.positions.Left}
				drawerType="slide"
				renderNavigationView={() => (
					<VStack>
						<Text>left drawer content</Text>
						<Button
							onPress={() => {
								AsyncStorage.removeItem("accessToken");
								DevSettings.reload();
							}}
						>
							Logout
						</Button>
					</VStack>
				)}
			>
				<HStack bg="#5f00ee" px={1} py={3} justifyContent="space-between" alignItems="center">
					<HStack space={4} alignItems="center">
						<IconButton
							// @ts-ignore
							onPress={() => drawer.current?.openDrawer({ speed: 1000, velocity: 0 })}
							icon={<HamburgerIcon />}
						/>
						<Text color="white" fontSize={20} fontWeight="bold">
							Home
						</Text>
					</HStack>
				</HStack>
			</DrawerLayout>
		</DrawerLayout>
	);
};
