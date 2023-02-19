import { observer } from "mobx-react";
import React from "react";
import { StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Container from "../components/Container";
import { RootStackScreenProps } from "../types";
import { t } from "../utils/i18n";

function MobileRoot({ navigation }: RootStackScreenProps<"App">) {
	const handleLogin = () => {
		navigation.navigate("Login");
	};

	const handleRegister = () => {
		navigation.navigate("Register");
	};

	const handleSettings = () => {
		navigation.navigate("Settings");
	};

	return (
		<Container
			displayFlex
			flexOne
			style={styles.rootContainer}
			element={SafeAreaView}
		>
			<Container horizontalCenter style={[styles.rootContentContainer]}>
				{/* Header, Branding */}
				<Container horizontalCenter style={styles.headingContainer}>
					<Text
						variant="headlineSmall"
						style={[styles.text, { fontWeight: "600" }]}
					>
						{t("root:WELCOME_TITLE_MOBILE")}
					</Text>
					<Text variant="bodyMedium" style={styles.text}>
						{t("root:WELCOME_SUBTITLE_MOBILE")}
					</Text>
				</Container>

				{/* Action Items */}
				<Container
					testID="mobileRootActionContainer"
					style={styles.rootActionContainer}
				>
					<Button
						mode="contained"
						style={styles.button}
						onPress={handleRegister}
					>
						{t("root:ACTION_MOBILE_REGISTER")}
					</Button>
					<Button
						mode="contained"
						style={styles.button}
						onPress={handleLogin}
					>
						{t("root:ACTION_MOBILE_LOGIN")}
					</Button>
					<Button
						mode="contained"
						style={styles.button}
						onPress={handleSettings}
					>
						Settings
					</Button>
				</Container>
			</Container>
		</Container>
	);
}

const styles = StyleSheet.create({
	rootContainer: {
		justifyContent: "flex-end",
		width: "100%",
	},
	rootContentContainer: {
		padding: 20,
	},
	headingContainer: {
		marginBottom: 20,
	},
	rootActionContainer: {
		width: "100%",
		marginTop: 10,
	},
	button: {
		marginVertical: 5,
	},
	text: {
		textAlign: "center",
		margin: 5,
	},
});

export default observer(MobileRoot);
