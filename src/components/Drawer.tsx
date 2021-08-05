import React, { ReactNode, useEffect, useRef, useState } from "react";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { Box, HamburgerIcon, HStack, Icon, IconButton, Text, Tooltip, VStack } from "native-base";
import { useWindowDimensions } from "react-native";
import ChannelSidebar from "../pages/channel/sidebar";
import GuildSidebar from "../pages/guild/sidebar";
import { useDesktop } from "../util/MediaQuery";
import TabBar from "./TabBar";
import SettingsModal from "../pages/settings/modal";
import { Channel, Guild } from "fosscord.js";

export default ({ children, channel, guild }: { children?: ReactNode; channel?: Channel; guild?: Guild }) => {
	const [settingsModal, setSettingsModal] = useState(false);
	const leftDrawer = useRef<any>(null);
	const rightDrawer = useRef<any>(null);
	const window = useWindowDimensions();
	const destopModus = useDesktop();

	useEffect(() => {
		if (destopModus) {
			leftDrawer.current?.openDrawer();
		}
	}, []);

	const width = !destopModus ? window.width * 0.75 : 312;

	return (
		<>
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
					// @ts-ignore
					drawerPosition={DrawerLayout.positions.Left}
					// @ts-ignore
					drawerType={!destopModus && "slide"}
					renderNavigationView={() => (
						<Box style={{ height: "100%", display: "flex", flexDirection: "column" }}>
							<HStack style={{ width: "100%", flexGrow: 1, height: "50%" }}>
								<GuildSidebar />
								<ChannelSidebar guild={guild} />
							</HStack>
							<TabBar setOpen={setSettingsModal} />
						</Box>
					)}
				>
					<HStack bg="primary.400" px={1} py={3} justifyContent="space-between" alignItems="center">
						<HStack space={4} alignItems="center">
							{!destopModus && (
								<IconButton onPress={() => leftDrawer.current?.openDrawer()} icon={<HamburgerIcon />} />
							)}
							<Text mx={2} color="white" fontSize={20} fontWeight="bold">
								{channel?.name || "Channel"}
							</Text>
						</HStack>
					</HStack>
					{children}
					{/* Content */}
					<SettingsModal open={settingsModal} setOpen={setSettingsModal} />
				</DrawerLayout>
			</DrawerLayout>
		</>
	);
};
