import { observer } from "mobx-react";
import React from "react";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";
import {
	Button,
	IconButton,
	Surface,
	Text,
	TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Container from "../components/Container";
import { DefaultRouteSettings, Globals } from "../constants/Globals";
import { RootStackScreenProps } from "../types";

function TempSettingsScreen({ navigation }: RootStackScreenProps<"Settings">) {
	const dimensions = useWindowDimensions();

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

	const handleBack = () => {
		navigation.goBack();
	};

	const reset = async () => {
		setLoading(true);
		setRouteSettings(DefaultRouteSettings);
		Globals.routeSettings = DefaultRouteSettings;
		await Globals.save();
		setLoading(false);
	};

	return (
		<Container
			testID="mainContainer"
			horizontalCenter
			verticalCenter
			flexOne
			element={SafeAreaView}
		>
			<Surface
				testID="innerContainer"
				style={[
					styles.loginContainer,
					{
						minWidth: !Platform.isMobile
							? dimensions.width / 2.5
							: dimensions.width,
					},
				]}
			>
				<Container
					testID="contentContainer"
					verticalCenter
					style={styles.contentContainer}
				>
					{/* Mobile Back Button */}
					{Platform.isMobile && (
						<IconButton
							icon="arrow-left"
							size={20}
							onPress={handleBack}
							style={styles.mobileBack}
						/>
					)}
					{/* Header */}
					<Container
						testID="headerContainer"
						horizontalCenter
						style={{ marginTop: 80 }}
					>
						<Text>
							Temporary screen for mobile unauthenticated settings
						</Text>
					</Container>

					{/* Form */}
					<Container
						testID="formContainer"
						style={styles.formContainer}
					>
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
								placeholder={
									DefaultRouteSettings.scheduledEvent
								}
								onChangeText={onSettingChange("scheduledEvent")}
								style={{ marginVertical: 10 }}
							/>
						</Container>
						<Button onPress={reset} loading={isLoading}>
							Reset route settings to default
						</Button>
					</Container>
				</Container>
			</Surface>
		</Container>
	);
}

const styles = StyleSheet.create({
	mobileBack: {
		position: "absolute",
		top: 0,
		left: 0,
	},
	loginContainer: {
		padding: 32,
		borderRadius: 8,
	},
	contentContainer: {
		height: "100%",
	},
	formContainer: {
		marginVertical: 32,
	},
	input: {
		marginVertical: 8,
	},
	helperText: {
		fontStyle: "italic",
	},
	link: {
		color: "#7289da",
	},
	buttonLabel: { fontWeight: "400", fontSize: 16 },
});

export default observer(TempSettingsScreen);
