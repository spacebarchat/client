import { Link } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import {
	GestureResponderEvent,
	Platform,
	StyleSheet,
	useWindowDimensions,
} from "react-native";
import {
	Button,
	HelperText,
	IconButton,
	Surface,
	Text,
	TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Container from "../components/Container";
import { RootStackScreenProps } from "../types";
import { t } from "../utils/i18n";

function RegisterScreen({ navigation }: RootStackScreenProps<"Register">) {
	const dimensions = useWindowDimensions();

	const [email, setEmail] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [dob, setDob] = React.useState("");
	const [error, setError] = React.useState<{
		email?: string;
		username?: string;
		password?: string;
		dob?: string;
	}>({ email: "", username: "", password: "", dob: "" });
	const [isLoading, setIsLoading] = React.useState(false);

	const handleSubmit = (e: GestureResponderEvent) => {
		e.preventDefault();
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
			setError({
				email: "this is a test error",
				username: "this is a test error",
				password: "this is a test error",
				dob: "this is a test error",
			});
		}, 2000);
	};

	const handleBack = () => {
		navigation.goBack();
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
					<Container testID="headerContainer" horizontalCenter>
						<Text
							variant="headlineSmall"
							style={{ fontWeight: "600" }}
						>
							{t("register:TITLE")}
						</Text>
						{!Platform.isMobile && (
							<Link to={{ screen: "Login" }} style={styles.link}>
								<Text
									variant="bodyLarge"
									style={[
										{ fontWeight: "400", marginRight: 5 },
										styles.link,
									]}
								>
									{t("register:LINK_LOGIN")}
								</Text>
							</Link>
						)}
					</Container>

					{/* Form */}
					<Container
						testID="formContainer"
						style={styles.formContainer}
					>
						{/* Email */}
						<Container testID="emailWrapper">
							<TextInput
								label={t("register:LABEL_EMAIL") as string}
								textContentType="emailAddress"
								value={email}
								onChangeText={(text) => setEmail(text)}
								style={styles.input}
								disabled={isLoading}
								error={!!error.email}
							/>
							<HelperText
								type="error"
								visible={!!error.email}
								style={styles.helperText}
							>
								{error.email}
							</HelperText>
						</Container>

						<Container testID="usernameWrapper">
							<TextInput
								label={t("register:LABEL_USERNAME") as string}
								textContentType="username"
								value={username}
								onChangeText={(text) => setUsername(text)}
								style={styles.input}
								disabled={isLoading}
								error={!!error.username}
							/>
							<HelperText
								type="error"
								visible={!!error.username}
								style={styles.helperText}
							>
								{error.username}
							</HelperText>
						</Container>

						{/* Password */}
						<Container testID="passwordWrapper">
							<TextInput
								label={t("register:LABEL_PASSWORD") as string}
								textContentType="password"
								secureTextEntry
								value={password}
								onChangeText={(text) => setPassword(text)}
								style={styles.input}
								disabled={isLoading}
								error={!!error.password}
							/>
							<HelperText
								type="error"
								visible={!!error.password}
								style={styles.helperText}
							>
								{error.password}
							</HelperText>
						</Container>

						{/* Date of Birth */}
						{/* <Container testID="dobWrapper">
              </Container> */}

						{/* Create Account Button */}
						<Button
							mode="contained"
							disabled={isLoading}
							loading={isLoading}
							onPress={handleSubmit}
							style={{ marginVertical: 16 }}
							labelStyle={styles.buttonLabel}
						>
							{t("register:BUTTON_CREATE_ACCOUNT")}
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

export default observer(RegisterScreen);
