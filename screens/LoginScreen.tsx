import { Link } from "@react-navigation/native";
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
import Container from "../components/Container";
import HCaptcha, { HCaptchaMessage } from "../components/HCaptcha";
import useLogger from "../hooks/useLogger";
import { IAPILoginRequest, IAPILoginResponse } from "../interfaces/IAPILogin";
import { DomainContext } from "../stores/DomainStore";
import { RootStackScreenProps } from "../types";
import Endpoints from "../utils/Endpoints";
import { t } from "../utils/i18n";

function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
  const dimensions = useWindowDimensions();
  const domain = React.useContext(DomainContext);
  const logger = useLogger("LoginScreen");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<{
    email?: string;
    username?: string;
    password?: string;
    dob?: string;
  }>({ email: "", password: "" });
  const [isLoading, setIsLoading] = React.useState(false);
  const [captchaModalVisible, setCaptchaModalVisible] = React.useState(false);
  const [captchaSiteKey, setCaptchaSiteKey] = React.useState<
    string | undefined
  >();
  const [captchaKey, setCaptchaKey] = React.useState<string | undefined>();

  const hideCaptchaModal = () => setCaptchaModalVisible(false);
  const showCaptchaModal = () => setCaptchaModalVisible(true);

  const handleSubmit = (e?: GestureResponderEvent) => {
    if (isLoading && !captchaKey) return;
    e?.preventDefault();
    setIsLoading(true);
    domain.rest
      .post<IAPILoginRequest, IAPILoginResponse>(Endpoints.LOGIN, {
        login: email,
        password,
        captcha_key: captchaKey,
      })
      .then((res) => {
        // TODO: process field errors

        if ("captcha_key" in res) {
          const { captcha_key, captcha_service, captcha_sitekey } = res;
          if (captcha_key[0] === "captcha-required") {
            if (captcha_service === "hcaptcha") {
              logger.debug("hCaptcha required");
              setCaptchaSiteKey(captcha_sitekey);
              showCaptchaModal();
            } else {
              setError({
                email: `Unhandled captcha_service ${captcha_service} `,
              });
              setIsLoading(false);
            }
          } else {
            setError({
              email: `Unhandled captcha_key ${captcha_key} `,
            });
            setIsLoading(false);
          }
        } else if ("mfa" in res) {
          // TODO: hanlde mfa
          logger.debug("mfa required");
        } else if ("token" in res) {
          // TODO: handle success
          logger.debug("success");
        } else {
          // TODO: unexpected response
          logger.debug("unexpected response");
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setError({
          email: e.message,
        });
      });
  };

  const handleBack = () => {
    setIsLoading(true);
    navigation.goBack();
  };

  const handlePasswordReset = () => {
    if (isLoading) return;
    setIsLoading(true);
    if (!email || email == "") {
      setError({
        email: t("common:errors.INVALID_LOGIN") as string,
      });
      setIsLoading(false);
      return;
    }

    // TODO: password reset request
    // TODO: show modal on success (/failure?)
    logger.debug("handle password reset");
    setIsLoading(false);
  };

  const onCaptchaMessage = (message: HCaptchaMessage) => {
    const { event, data } = message;
    switch (event) {
      case "cancel":
        logger.debug("[HCaptcha] Captcha cancelled by user");
        hideCaptchaModal();
        break;
      case "close":
        logger.debug("[HCaptcha] Captcha closed");
        break;
      case "challenge-expired":
      case "data-expired":
        logger.debug("[HCaptcha] Captcha expired");
        hideCaptchaModal();
        break;
      case "open":
        logger.debug("[HCaptcha] Captcha opened");
        break;
      case "error":
        logger.error("[HCaptcha] Captcha error", error);
        hideCaptchaModal();
        break;
      case "data":
        logger.debug("[HCaptcha] Captcha data", data);
        hideCaptchaModal();
        setCaptchaKey(data);
        break;
    }
  };

  React.useEffect(() => {
    if (!captchaKey) return;
    logger.debug("captcha key", captchaKey);
    setCaptchaSiteKey(undefined);

    // resubmit the login request, it will have the captcha token now
    handleSubmit();
  }, [captchaKey]);

  return (
    <Container testID="mainContainer" horizontalCenter verticalCenter flexOne>
      <Portal>
        <Modal
          visible={captchaModalVisible}
          onDismiss={hideCaptchaModal}
          style={styles.modalContainer}
          contentContainerStyle={styles.modalContentContainer}
        >
          {captchaSiteKey && (
            <HCaptcha siteKey={captchaSiteKey} onMessage={onCaptchaMessage} />
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
            <Text variant="headlineSmall" style={{ fontWeight: "600" }}>
              {t("login:TITLE")}
            </Text>
            {!Platform.isMobile && (
              <Link to={{ screen: "Register" }} style={styles.link}>
                <Text
                  variant="bodyLarge"
                  style={[{ fontWeight: "400", marginRight: 5 }, styles.link]}
                >
                  {t("login:NEED_ACCOUNT")}
                </Text>
              </Link>
            )}
          </Container>

          {/* Form */}
          <Container testID="formContainer" style={styles.formContainer}>
            {/* Email */}
            <Container testID="emailWrapper">
              <TextInput
                label={t("login:LABEL_EMAIL") as string}
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

            {/* Password */}
            <Container testID="passwordWrapper">
              <TextInput
                label={t("login:LABEL_PASSWORD") as string}
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
              <Container testID="forgotPasswordContainer">
                <Text style={styles.link} onPress={handlePasswordReset}>
                  {t("login:LABEL_FORGOT_PASSWORD")}
                </Text>
              </Container>
            </Container>

            {/* Login Button */}
            <Button
              mode="contained"
              disabled={isLoading}
              loading={isLoading}
              onPress={handleSubmit}
              style={{ marginVertical: 16 }}
              labelStyle={styles.buttonLabel}
            >
              {t("login:BUTTON_LOGIN")}
            </Button>

            {/* Login Button */}
            <Button
              mode="contained"
              disabled={isLoading}
              loading={isLoading}
              onPress={() => {
                showCaptchaModal();
              }}
              style={{ marginVertical: 16 }}
              labelStyle={styles.buttonLabel}
            >
              Show Modal
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
    // minWidth: 800,
    // minHeight: 400,
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
    cursor: "pointer",
  },
  buttonLabel: { fontWeight: "400", fontSize: 16 },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
