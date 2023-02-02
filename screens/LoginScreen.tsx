import { Link } from "@react-navigation/native";
import React, { useContext } from "react";
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
import Container from "../components/Container";
import useLogger from "../hooks/useLogger";
import { IAPILoginRequest, IAPILoginResponse } from "../interfaces/IAPILogin";
import { DomainContext } from "../stores/DomainStore";
import { RootStackScreenProps } from "../types";
import Endpoints from "../utils/Endpoints";
import { t } from "../utils/i18n";

function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
  const dimensions = useWindowDimensions();
  const domain = useContext(DomainContext);
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

  const handleSubmit = (e: GestureResponderEvent) => {
    if (isLoading) return;
    e.preventDefault();
    setIsLoading(true);
    domain.rest
      .post<IAPILoginRequest, IAPILoginResponse>(Endpoints.LOGIN, {
        login: email,
        password,
      })
      .then((res) => {
        if ("captcha_key" in res) {
          // TODO: Handle captcha
        } else if ("mfa" in res) {
          // TODO: hanlde mfa
        } else if ("token" in res) {
          // TODO: handle success
        } else {
          // TODO: unexpected response
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

  return (
    <Container testID="mainContainer" horizontalCenter verticalCenter flexOne>
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
            <Text variant="bodyLarge" style={{ fontWeight: "400" }}>
              {t("login:SUBTITLE")}
            </Text>
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
            >
              {t("login:BUTTON_LOGIN")}
            </Button>
            {!Platform.isMobile && (
              <Container horizontalCenter row>
                <Text style={{ marginRight: 5 }}>
                  {t("login:NEED_ACCOUNT")}
                </Text>
                <Link to={{ screen: "Register" }} style={styles.link}>
                  {t("login:REGISTER")}
                </Link>
              </Container>
            )}
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
});

export default LoginScreen;
