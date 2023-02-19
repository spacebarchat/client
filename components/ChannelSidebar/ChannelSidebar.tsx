import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import { ScrollView, SectionList } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../../constants/Colors";
import { DomainContext } from "../../stores/DomainStore";
import Guild from "../../stores/Guild";
import Container from "../Container";

interface Props {
	guild: Guild | undefined;
}

// TODO: lighter background color for current channel item
// TODO: ability to click a channel item to switch to that channel
// TODO: hover color for channel items
function ChannelSidebar({ guild }: Props) {
	const theme = useTheme<CustomTheme>();
	const domain = React.useContext(DomainContext);

	return (
		<Container
			testID="channelSidebar"
			style={{
				backgroundColor: theme.colors.palette.backgroundPrimary70,
				height: "100%",
				width: 240,
			}}
		>
			<Container testID="channelsWrapper" displayFlex flexOne>
				<Container
					testID="channelHeader"
					verticalCenter
					horizontalCenter
					style={{
						height: 48,
						backgroundColor:
							theme.colors.palette.backgroundPrimary70,
					}}
					isSurface
					elevation={1}
				>
					<Text>{guild?.name}</Text>
				</Container>
				<Container displayFlex flexOne>
					<ScrollView style={{ padding: 10 }}>
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
									<Link
										to={`/channels/${guild!.id}/${item.id}`}
									>
										<Text
											style={{
												color: theme.colors.textMuted,
											}}
										>
											{item.name}
										</Text>
									</Link>
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
					</ScrollView>
				</Container>
			</Container>
			<Container
				testID="channelFooter"
				style={{
					backgroundColor: theme.colors.palette.backgroundPrimary50,
				}}
			>
				<Container
					testID="userActions"
					displayFlex
					row
					horizontalCenter
					style={{
						height: 52,
						paddingVertical: 8,
						backgroundColor: "transparent",
					}}
				>
					<Container style={{ marginHorizontal: 8 }}>
						<Avatar.Image
							size={32}
							source={{ uri: domain.account.user?.avatarURL }}
						/>
					</Container>
					<Container>
						<Text>
							{domain.account.user?.username}#
							{domain.account.user?.discriminator}
						</Text>
					</Container>
				</Container>
			</Container>
		</Container>
	);
}

export default observer(ChannelSidebar);
