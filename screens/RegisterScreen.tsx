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
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import Container from "../components/Container";
import { RootStackScreenProps } from "../types";

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
        email: "Email or password is invalid.",
        username: "Email or password is invalid.",
        password: "Email or password is invalid.",
        dob: "Email or password is invalid.",
      });
    }, 2000);
  };

  const handleBack = () => {
    navigation.goBack();
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
              Create an account
            </Text>
          </Container>

          {/* Form */}
          <Container testID="formContainer" style={styles.formContainer}>
            {/* Email */}
            <Container testID="emailWrapper">
              <TextInput
                label="Email"
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
                label="Username"
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
                label="Password"
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
            </Container>

            {/* Date of Birth */}
            {/* <Container testID="dobWrapper">
              </Container> */}

            {/* Continue Button */}
            <Button
              mode="contained"
              disabled={isLoading}
              loading={isLoading}
              onPress={handleSubmit}
              style={{ marginVertical: 16 }}
            >
              Continue
            </Button>
            {!Platform.isMobile && (
              <Container horizontalCenter row>
                <Link to={{ screen: "Login" }} style={styles.link}>
                  Already have an account?
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
});

export default RegisterScreen;
