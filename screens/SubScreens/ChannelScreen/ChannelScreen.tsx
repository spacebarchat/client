import { observer } from "mobx-react";
import React from "react";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import ChannelHeader from "../../../components/ChannelHeader";
import ChannelSidebar from "../../../components/ChannelSidebar/ChannelSidebar";
import Container from "../../../components/Container";
import MemberList from "../../../components/MemberList/MemberList";
import MessageList from "../../../components/MessageList";
import { CustomTheme } from "../../../constants/Colors";
import { DefaultRouteSettings, Globals } from "../../../constants/Globals";
import useChannel from "../../../hooks/useChannel";
import useGuild from "../../../hooks/useGuild";
import { DomainContext } from "../../../stores/DomainStore";
import { ChannelsStackScreenProps } from "../../../types";

function ChannelScreen({
	route: {
		params: { guildId, channelId },
	},
}: ChannelsStackScreenProps<"Channel">) {
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
					<TextInput
						label="API URL"
						value={routeSettings.api}
						placeholder={DefaultRouteSettings.api}
						onChangeText={onSettingChange("api")}
						style={{ marginVertical: 10 }}
					/>
					<TextInput
						label="CDN URL"
						value={routeSettings.cdn}
						placeholder={DefaultRouteSettings.cdn}
						onChangeText={onSettingChange("cdn")}
						style={{ marginVertical: 10 }}
					/>
					<TextInput
						label="Gateway URL"
						value={routeSettings.gateway}
						placeholder={DefaultRouteSettings.gateway}
						onChangeText={onSettingChange("gateway")}
						style={{ marginVertical: 10 }}
					/>
					<TextInput
						label="Invite URL"
						value={routeSettings.invite}
						placeholder={DefaultRouteSettings.invite}
						onChangeText={onSettingChange("invite")}
						style={{ marginVertical: 10 }}
					/>
					<TextInput
						label="Template URL"
						value={routeSettings.template}
						placeholder={DefaultRouteSettings.template}
						onChangeText={onSettingChange("template")}
						style={{ marginVertical: 10 }}
					/>
					<TextInput
						label="Gift URL"
						value={routeSettings.gift}
						placeholder={DefaultRouteSettings.gift}
						onChangeText={onSettingChange("gift")}
						style={{ marginVertical: 10 }}
					/>
					<TextInput
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
					backgroundColor: theme.colors.palette.backgroundPrimary100,
				}}
				displayFlex
				flexOne
			>
				<ChannelHeader channel={channel} />
				<Container testID="chat" displayFlex flexOne row>
					<MessageList channel={channel} guild={guild}></MessageList>

					<Container
						testID="memberList"
						style={{
							width: 240,
							backgroundColor:
								theme.colors.palette.backgroundPrimary70,
						}}
						displayFlex
					>
						<MemberList guild={guild} channel={channel} />
					</Container>
				</Container>
			</Container>
		</Container>
	);
}

export default observer(ChannelScreen);
