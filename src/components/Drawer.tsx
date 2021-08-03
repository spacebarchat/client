import React, { useEffect, useRef, useState } from "react";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import {
	Box,
	Button,
	HamburgerIcon,
	HStack,
	Icon,
	IconButton,
	Text,
	Tooltip,
	VStack,
} from "native-base";
import { Pressable, useWindowDimensions } from "react-native";
import DevSettings from "./DevSettings";
import ChannelSidebar from "../pages/channel/sidebar";
import GuildSidebar from "../pages/guild/sidebar";
// AsyncStorage.removeItem("accessToken");
import FosscordLogo from "../assets/images/icon_round_256_blue.png";
import { FaCogs, FaSingOutAlt, FaUserCircle, FaUsers } from "../assets/images/icons";
import { useDesktop } from "../util/MediaQuery";

export default () => {
	const leftDrawer = useRef(null);
	const rightDrawer = useRef(null);
	const window = useWindowDimensions();
	const [destopModus, setDestopModus] = useState(useDesktop());

	useEffect(() => {
		if (destopModus) {
			leftDrawer.current?.openDrawer();
		}
	}, []);

	const width = !destopModus ? window.width * 0.75 : 250;

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
				ref={leftDrawer}
				overlayColor="transparent"
				edgeWidth={200}
				drawerWidth={width}
				drawerPosition={DrawerLayout.positions.Left}
				drawerType={!destopModus && "slide"}
				renderNavigationView={() => (
					<VStack style={{ borderColor: "white", borderWidth: 1, height: "100%" }}>
						<HStack>
							<GuildSidebar />
							<ChannelSidebar />
						</HStack>
						<HStack
							w="100%"
							style={{
								position: "absolute",
								bottom: 0,
								justifyContent: "space-around",
								borderTopColor: "grey",
								borderTopWidth: 1,
							}}
							p={1}
						>
							{/* Home */}
							<Tooltip label={"Home"} placement={"top"}>
								<Pressable>
									<Image
										style={{
											width: 40,
											height: 40,
										}}
										source={FosscordLogo}
										mx={1}
									/>
								</Pressable>
							</Tooltip>
							{/* Friends */}
							<Tooltip label={"Friends"} placement={"top"}>
								<Pressable>
									<FaUsers
										style={{
											width: 40,
											height: 40,
										}}
										mx={1}
									/>
								</Pressable>
							</Tooltip>
							{/* Profil */}
							<Tooltip label={"Profile"} placement={"top"}>
								<Pressable>
									<FaUserCircle
										style={{
											width: 40,
											height: 40,
										}}
										mx={1}
									/>
								</Pressable>
							</Tooltip>
							{/* Einstellungen */}
							<Tooltip label={"Settings"} placement={"top"}>
								<Pressable>
									<FaCogs
										style={{
											width: 40,
											height: 40,
										}}
										mx={1}
									/>
								</Pressable>
							</Tooltip>
							{/* Logout */}
							<Tooltip label={"Logout"} placement={"top"}>
								<Pressable
									onPress={() => {
										AsyncStorage.removeItem("accessToken");
										DevSettings.reload();
									}}
								>
									<FaSingOutAlt
										style={{
											width: 40,
											height: 40,
										}}
										mx={1}
									/>
								</Pressable>
							</Tooltip>
						</HStack>
					</VStack>
				)}
			>
				<HStack
					bg="#6200ee"
					px={1}
					py={3}
					justifyContent="space-between"
					alignItems="center"
				>
					<HStack space={4} alignItems="center">
						{!destopModus && (
							<IconButton
								onPress={() => leftDrawer.current?.openDrawer()}
								icon={<HamburgerIcon />}
							/>
						)}
						<Text color="white" fontSize={20} fontWeight="bold">
							Home
						</Text>
					</HStack>
				</HStack>
			</DrawerLayout>
		</DrawerLayout>
	);
};
