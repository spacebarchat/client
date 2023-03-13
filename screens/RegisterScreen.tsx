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
	Modal,
	Portal,
	Surface,
	Text,
	TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Container from "../components/Container";
import HCaptcha, { HCaptchaMessage } from "../components/HCaptcha";
import { IAPIRegisterResponse, RegisterSchema } from "../interfaces/api";
import { DomainContext } from "../stores/DomainStore";
import { RootStackScreenProps } from "../types";
import { Routes } from "../utils/Endpoints";
import { t } from "../utils/i18n";
import Logger from "../utils/Logger";

function RegisterScreen({ navigation }: RootStackScreenProps<"Register">) {
	const dimensions = useWindowDimensions();
	const domain = React.useContext(DomainContext);

	const [email, setEmail] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [dob, setDob] = React.useState("");
	const [captchaModalVisible, setCaptchaModalVisible] = React.useState(false);
	const [captchaSiteKey, setCaptchaSiteKey] = React.useState<
		string | undefined
	>();
	const [captchaKey, setCaptchaKey] = React.useState<string | undefined>();
	const [error, setError] = React.useState<{
		email?: string;
		username?: string;
		password?: string;
		dob?: string;
	}>({ email: "", username: "", password: "", dob: "" });
	const [isLoading, setIsLoading] = React.useState(false);
	const hideCaptchaModal = () => setCaptchaModalVisible(false);
	const showCaptchaModal = () => setCaptchaModalVisible(true);

	const handleSubmit = (e?: GestureResponderEvent) => {
		e?.preventDefault();
		setIsLoading(true);

		domain.rest
			.post<RegisterSchema, IAPIRegisterResponse>(Routes.register(), {
				consent: true,
				username,
				email,
				password,
				date_of_birth: dob || new Date("2000-01-01").toISOString(),
				captcha_key: captchaKey,
			})
			.then((res) => {
				if ("message" in res) {
					Logger.debug("error", res);
					setError({
						email: res.message,
					});
					setIsLoading(false);
				} else if ("token" in res) {
					Logger.debug("success", res);
					domain.account.setToken(res.token);
					setIsLoading(false);
				} else if ("captcha_key" in res) {
					const { captcha_key, captcha_service, captcha_sitekey } =
						res;
					if (captcha_key[0] === "captcha-required") {
						if (captcha_service === "hcaptcha") {
							Logger.debug("hCaptcha required");
							setCaptchaSiteKey(captcha_sitekey);
							showCaptchaModal();
							return;
						}

						setError({
							email: `Unhandled captcha_service ${captcha_service} `,
						});
						setCaptchaKey(undefined);
						setCaptchaSiteKey(undefined);
						setIsLoading(false);
						return;
					}

					setError({
						email: `Unhandled captcha_key ${captcha_key} `,
					});
					setCaptchaKey(undefined);
					setCaptchaSiteKey(undefined);
					setIsLoading(false);
				}
			});
	};

	React.useEffect(() => {
		if (!captchaKey) return;
		setCaptchaSiteKey(undefined);

		handleSubmit();
	}, [captchaKey]);

	const handleBack = () => {
		navigation.goBack();
	};

	const onCaptchaMessage = (message: HCaptchaMessage) => {
		const { event, data } = message;
		switch (event) {
			case "cancel":
				Logger.debug("[HCaptcha] Captcha cancelled by user");
				hideCaptchaModal();
				break;
			case "close":
				Logger.debug("[HCaptcha] Captcha closed");
				break;
			case "challenge-expired":
			case "data-expired":
				Logger.debug("[HCaptcha] Captcha expired");
				hideCaptchaModal();
				break;
			case "open":
				Logger.debug("[HCaptcha] Captcha opened");
				break;
			case "error":
				Logger.error("[HCaptcha] Captcha error", error);
				hideCaptchaModal();
				break;
			case "data":
				Logger.debug("[HCaptcha] Captcha data", data);
				hideCaptchaModal();
				setCaptchaKey(data);
				break;
		}
	};

	return (
		<Container
			testID="mainContainer"
			horizontalCenter
			verticalCenter
			flexOne
			element={SafeAreaView}
		>
			<Portal>
				<Modal
					visible={captchaModalVisible}
					onDismiss={() => {
						hideCaptchaModal();
						setIsLoading(false);
					}}
					style={styles.modalContainer}
					contentContainerStyle={styles.modalContentContainer}
				>
					{captchaSiteKey && (
						<HCaptcha
							siteKey={captchaSiteKey}
							onMessage={onCaptchaMessage}
						/>
					)}
				</Modal>
			</Portal>
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
	modalContainer: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContentContainer: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default observer(RegisterScreen);
