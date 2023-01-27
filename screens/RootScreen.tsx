import { useContext, useEffect } from "react";
import { Platform, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import Container from "../components/Container";
import { DomainContext } from "../stores/DomainStore";
import { RootStackScreenProps } from "../types";

export default function RootScreen({
  navigation,
}: RootStackScreenProps<"Root">) {
  const domain = useContext(DomainContext);

  useEffect(() => {
    // if the user is not logged in, redirect to the login screen
    if (!domain.account.isAuthenticated && !Platform.isMobile) {
      navigation.navigate("Login");
    }
  }, []);

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  if (Platform.isMobile) {
    return (
      <Container flex style={styles.rootContainer}>
        <Container horizontalCenter style={[styles.rootContentContainer]}>
          {/* Header, Branding */}
          <Container horizontalCenter style={styles.headingContainer}>
            <Text
              variant="headlineSmall"
              style={[styles.text, { fontWeight: "600" }]}
            >
              Welcome to Fosscord
            </Text>
            <Text variant="bodyMedium" style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
              Register
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleLogin}
            >
              Log In
            </Button>
          </Container>
        </Container>
      </Container>
    );
  }

  return (
    <Container>
      <Text variant="headlineLarge">Root</Text>
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
