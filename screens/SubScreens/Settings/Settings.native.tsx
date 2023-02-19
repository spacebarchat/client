import { observer } from "mobx-react";
import React from "react";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Container from "../../../components/Container";
import { DefaultRouteSettings, Globals } from "../../../constants/Globals";
import { DomainContext } from "../../../stores/DomainStore";
import { ChannelsStackScreenProps } from "../../../types";

function Settings({ navigation }: ChannelsStackScreenProps<"Settings">) {
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
		<Container element={SafeAreaView}>
			<Text>Settings</Text>
			<Button mode="contained" onPress={domain.toggleDarkTheme}>
				Toggle Theme
			</Button>
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
		</Container>
	);
}

export default observer(Settings);
