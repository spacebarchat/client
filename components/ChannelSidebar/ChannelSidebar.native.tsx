import { MaterialCommunityIcons } from "@expo/vector-icons";
import { observer } from "mobx-react";
import React from "react";
import { SectionList } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../../constants/Colors";
import Guild from "../../stores/Guild";
import Container from "../Container";

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
				isSurface
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
					renderItem={({ item }) => (
						<Container
							row
							horizontalCenter
							style={{ marginHorizontal: 10 }}
						>
							{item.channelIcon && (
								<MaterialCommunityIcons
									name={item.channelIcon! as any}
									size={16}
									color={theme.colors.textMuted}
									style={{ marginRight: 5 }}
								/>
							)}
							<Text style={{ color: theme.colors.textMuted }}>
								{item.name}
							</Text>
						</Container>
					)}
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
