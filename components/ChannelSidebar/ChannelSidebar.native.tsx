import { observer } from "mobx-react";
import React from "react";
import { SectionList } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../../constants/Colors";
import Guild from "../../stores/Guild";
import Container from "../Container";
import ChannelItem from "./ChannelItem";

interface Props {
	guild: Guild;
}

// TODO: lighter background color for current channel item
// TODO: ability to click a channel item to switch to that channel
function ChannelSidebar({ guild }: Props) {
	const theme = useTheme<CustomTheme>();

	return (
		<Container
			testID="channelsSidebarContainer"
			flexOne
			style={{
				backgroundColor: theme.colors.palette.backgroundPrimary70,
				borderTopLeftRadius: 10,
				borderTopRightRadius: 10,
			}}
		>
			<Container
				testID="channelsSidebarHeader"
				verticalCenter
				horizontalCenter
				style={{
					height: 74,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
					backgroundColor: theme.colors.palette.backgroundPrimary70,
				}}
				element={Surface}
				elevation={1}
			>
				{/* TODO: private channels  */}
				<Text>{guild?.name}</Text>
			</Container>
			<Container testID="channelsSidebarList" flexOne>
				{/* TODO: private channels  */}
				<SectionList
					sections={guild?.channelList ?? []}
					keyExtractor={(item, index) => item.id + index}
					renderItem={({ item }) => <ChannelItem channel={item} />}
					renderSectionHeader={({ section: { title } }) => {
						if (!title) return null;
						return (
							<Container
								style={{
									backgroundColor:
										theme.colors.palette
											.backgroundPrimary70,
								}}
							>
								<Text>{title.toUpperCase()}</Text>
							</Container>
						);
					}}
					stickySectionHeadersEnabled={true}
					contentContainerStyle={{ padding: 10 }}
				/>
			</Container>
		</Container>
	);
}

export default observer(ChannelSidebar);
