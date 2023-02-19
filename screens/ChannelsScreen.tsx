import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import React from "react";
import { Animated, Platform, Pressable, ScrollView } from "react-native";
import {
	Avatar,
	Button,
	Text,
	TextInput as TextInputPaper,
	useTheme,
} from "react-native-paper";
import ChannelHeader from "../components/ChannelHeader";
import ChannelSidebar from "../components/ChannelSidebar";
import ChannelsSidebarMobile from "../components/ChannelsSidebarMobile";
import Container from "../components/Container";
import GuildListGuild from "../components/GuildListGuildItem";
import GuildSidebarMobile from "../components/GuildSidebarMobile";
import MemberList from "../components/MemberList";
import MembersListMobile from "../components/MembersListMobile";
import MessageList from "../components/MessageList";
import BottomTabBar from "../components/ReactNavigationBottomTabs/views/BottomTabBar";
import Swiper from "../components/Swiper";
import { CustomTheme } from "../constants/Colors";
import { DefaultRouteSettings, Globals } from "../constants/Globals";
import BottomTabBarProgressContext from "../contexts/BottomTabBarProgressContext";
import useChannel from "../hooks/useChannel";
import useGuild from "../hooks/useGuild";
import { DomainContext } from "../stores/DomainStore";
import {
	ChannelsParamList,
	ChannelsStackScreenProps,
	RootStackScreenProps,
} from "../types";

const Stack = createNativeStackNavigator<ChannelsParamList>();
const Tab = createBottomTabNavigator<ChannelsParamList>();

const ChannelDesktop = observer(
	({
		route: {
			params: { guildId, channelId },
		},
	}: ChannelsStackScreenProps<"Channel">) => {
		const theme = useTheme<CustomTheme>();
		const domain = React.useContext(DomainContext);
		const guild = useGuild(guildId, domain);
		const channel = useChannel(guildId, channelId, domain);
		const [isLoading, setLoading] = React.useState(false);
		const [routeSettings, setRouteSettings] = React.useState(
			Globals.routeSettings,
		);

		const onSettingChange = (key: keyof typeof Globals.routeSettings) => {
			return async (value: any) => {
				setRouteSettings({ ...routeSettings, [key]: value });
				Globals.routeSettings[key] = value;
				await Globals.save();
			};
		};

		const reset = async () => {
			setLoading(true);
			setRouteSettings(DefaultRouteSettings);
			Globals.routeSettings = DefaultRouteSettings;
			await Globals.save();
			setLoading(false);
		};

		if (!guild) {
			return (
				<Container>
					<Text>Guild not found</Text>
					<Container style={{ margin: 10 }}>
						<TextInputPaper
							label="API URL"
							value={routeSettings.api}
							placeholder={DefaultRouteSettings.api}
							onChangeText={onSettingChange("api")}
							style={{ marginVertical: 10 }}
						/>
						<TextInputPaper
							label="CDN URL"
							value={routeSettings.cdn}
							placeholder={DefaultRouteSettings.cdn}
							onChangeText={onSettingChange("cdn")}
							style={{ marginVertical: 10 }}
						/>
						<TextInputPaper
							label="Gateway URL"
							value={routeSettings.gateway}
							placeholder={DefaultRouteSettings.gateway}
							onChangeText={onSettingChange("gateway")}
							style={{ marginVertical: 10 }}
						/>
						<TextInputPaper
							label="Invite URL"
							value={routeSettings.invite}
							placeholder={DefaultRouteSettings.invite}
							onChangeText={onSettingChange("invite")}
							style={{ marginVertical: 10 }}
						/>
						<TextInputPaper
							label="Template URL"
							value={routeSettings.template}
							placeholder={DefaultRouteSettings.template}
							onChangeText={onSettingChange("template")}
							style={{ marginVertical: 10 }}
						/>
						<TextInputPaper
							label="Gift URL"
							value={routeSettings.gift}
							placeholder={DefaultRouteSettings.gift}
							onChangeText={onSettingChange("gift")}
							style={{ marginVertical: 10 }}
						/>
						<TextInputPaper
							label="Scheduled Event URL"
							value={routeSettings.scheduledEvent}
							placeholder={DefaultRouteSettings.scheduledEvent}
							onChangeText={onSettingChange("scheduledEvent")}
							style={{ marginVertical: 10 }}
						/>
					</Container>
					<Button onPress={reset} loading={isLoading}>
						Reset route settings to default
					</Button>
					<Button
						mode="contained"
						buttonColor={theme.colors.error}
						onPress={() => {
							domain.account.logout();
						}}
					>
						Logout
					</Button>
				</Container>
			);
		}

		if (!channel) {
			return (
				<Container>
					<Text>
						Could not find channel by id, or could not get the first
						channel in the guild
					</Text>
				</Container>
			);
		}

		return (
			<Container verticalCenter horizontalCenter flexOne displayFlex row>
				<ChannelSidebar guild={guild} />

				<Container
					testID="chatContainer"
					style={{
						height: "100%",
						backgroundColor:
							theme.colors.palette.backgroundPrimary100,
					}}
					displayFlex
					flexOne
				>
					<ChannelHeader channel={channel} />
					<Container testID="chat" displayFlex flexOne row>
						<MessageList
							channel={channel}
							guild={guild}
						></MessageList>

						<Container
							testID="memberList"
							style={{
								width: 240,
								backgroundColor:
									theme.colors.palette.backgroundPrimary70,
							}}
							displayFlex
						>
							<MemberList channel={channel} guild={guild} />
						</Container>
					</Container>
				</Container>
			</Container>
		);
	},
);

const ChannelsScreenDesktop = observer(
	({ navigation }: RootStackScreenProps<"Channels">) => {
		const domain = React.useContext(DomainContext);
		const theme = useTheme<CustomTheme>();

		return (
			<Container verticalCenter horizontalCenter flexOne displayFlex row>
				<Container
					testID="guildsList"
					style={{
						height: "100%",
						backgroundColor:
							theme.colors.palette.backgroundPrimary40,
						width: 72,
						zIndex: 3,
					}}
					displayFlex
					horizontalCenter
				>
					<ScrollView style={{ overflow: "visible" }}>
						<Pressable
							onPress={() => {
								navigation.navigate("Channels", {
									screen: "Channel",
									params: { guildId: "me" },
								});
							}}
						>
							<Avatar.Icon icon="home" size={48} />
						</Pressable>

						<Container
							testID="guildListGuildIconContainer"
							style={{ overflow: "visible" }}
						>
							{domain.guilds.asList().map((guild) => {
								return (
									<GuildListGuild
										key={guild.id}
										guild={guild}
										onPress={() => {
											navigation.navigate("Channels", {
												screen: "Channel",
												params: { guildId: guild.id },
											});
										}}
									/>
								);
							})}
						</Container>
					</ScrollView>
				</Container>

				<Container
					testID="outerContainer"
					style={{ height: "100%" }}
					displayFlex
					flexOne
					row
				>
					<Stack.Navigator
						initialRouteName="Channel"
						screenOptions={{
							headerShown: false,
						}}
					>
						<Stack.Screen
							name="Channel"
							component={ChannelDesktop}
							initialParams={{ guildId: "me" }}
						/>
					</Stack.Navigator>
				</Container>
			</Container>
		);
	},
);

function SettingsMobile({ navigation }: ChannelsStackScreenProps<"Settings">) {
	const domain = React.useContext(DomainContext);
	const [routeSettings, setRouteSettings] = React.useState(
		Globals.routeSettings,
	);

	const onSettingChange = (key: keyof typeof Globals.routeSettings) => {
		return async (value: any) => {
			setRouteSettings({ ...routeSettings, [key]: value });
			Globals.routeSettings[key] = value;
			await Globals.save();
		};
	};

	return (
		<Container isSafe>
			<Text>Settings</Text>
			<Button mode="contained" onPress={domain.toggleDarkTheme}>
				Toggle Theme
			</Button>
			<Container style={{ margin: 10 }}>
				<TextInputPaper
					label="API URL"
					value={routeSettings.api}
					placeholder={DefaultRouteSettings.api}
					onChangeText={onSettingChange("api")}
					style={{ marginVertical: 10 }}
				/>
				<TextInputPaper
					label="CDN URL"
					value={routeSettings.cdn}
					placeholder={DefaultRouteSettings.cdn}
					onChangeText={onSettingChange("cdn")}
					style={{ marginVertical: 10 }}
				/>
				<TextInputPaper
					label="Gateway URL"
					value={routeSettings.gateway}
					placeholder={DefaultRouteSettings.gateway}
					onChangeText={onSettingChange("gateway")}
					style={{ marginVertical: 10 }}
				/>
				<TextInputPaper
					label="Invite URL"
					value={routeSettings.invite}
					placeholder={DefaultRouteSettings.invite}
					onChangeText={onSettingChange("invite")}
					style={{ marginVertical: 10 }}
				/>
				<TextInputPaper
					label="Template URL"
					value={routeSettings.template}
					placeholder={DefaultRouteSettings.template}
					onChangeText={onSettingChange("template")}
					style={{ marginVertical: 10 }}
				/>
				<TextInputPaper
					label="Gift URL"
					value={routeSettings.gift}
					placeholder={DefaultRouteSettings.gift}
					onChangeText={onSettingChange("gift")}
					style={{ marginVertical: 10 }}
				/>
				<TextInputPaper
					label="Scheduled Event URL"
					value={routeSettings.scheduledEvent}
					placeholder={DefaultRouteSettings.scheduledEvent}
					onChangeText={onSettingChange("scheduledEvent")}
					style={{ marginVertical: 10 }}
				/>
			</Container>
		</Container>
	);
}

/**
 * Main screen rendering for mobile
 */
const ChannelMobile = observer((props: ChannelsStackScreenProps<"Channel">) => {
	let { guildId, channelId } = props.route.params;

	const theme = useTheme<CustomTheme>();
	const domain = React.useContext(DomainContext);
	const guild = useGuild(guildId, domain);
	const channel = useChannel(guildId, channelId, domain);

	/**
   Constructs the Guild Sidebar and Channel list for the left side of the Swipper component
   */
	const leftAction = (
		<Container flexOne row>
			<GuildSidebarMobile {...props} />
			<ChannelsSidebarMobile guild={guild} />
		</Container>
	);

	/**
	 * Constructs the Member list component for the right side of the swiper
	 */
	const rightAction =
		guild && channel ? (
			<MembersListMobile guild={guild} channel={channel} />
		) : null;

	return (
		<Swiper
			leftChildren={leftAction}
			rightChildren={rightAction}
			containerStyle={{
				backgroundColor: theme.colors.palette.backgroundPrimary40,
			}}
		>
			<Container
				flexOne
				style={{
					backgroundColor: theme.colors.palette.backgroundPrimary90,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
				}}
			>
				{!guild || !channel ? (
					<Text>AAAA</Text>
				) : (
					<>
						<ChannelHeader channel={channel} />
						<MessageList guild={guild} channel={channel} />
					</>
				)}
			</Container>
		</Swiper>
	);
});

const ChannelsScreenMobile = observer(() => {
	const theme = useTheme<CustomTheme>();

	return (
		<BottomTabBarProgressContext.Provider
			value={{
				progress: new Animated.Value(0),
				setProgress: (progress: number) => {},
			}}
		>
			<Tab.Navigator
				initialRouteName="Channel"
				screenOptions={{
					headerShown: false,
					// tabBarActiveBackgroundColor: theme.colors.primary,
					tabBarStyle: {
						backgroundColor:
							theme.colors.palette.backgroundPrimary0,
					},
					tabBarShowLabel: false,
				}}
				tabBar={(props) => <BottomTabBar {...props} />}
			>
				<Tab.Screen
					name="Channel"
					component={ChannelMobile}
					initialParams={{ guildId: "me" }}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="chat"
								color={color}
								size={size}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="Settings"
					component={SettingsMobile}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name="cog"
								color={color}
								size={size}
							/>
						),
					}}
				/>
			</Tab.Navigator>
		</BottomTabBarProgressContext.Provider>
	);
});

function ChannelsScreen(props: RootStackScreenProps<"Channels">) {
	const Element = Platform.isMobile
		? ChannelsScreenMobile
		: ChannelsScreenDesktop;

	return <Element {...props} />;
}

export default observer(ChannelsScreen);
