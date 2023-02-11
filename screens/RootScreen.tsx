import { t } from "i18next";
import { observer } from "mobx-react";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Container from "../components/Container";
import { CustomTheme } from "../constants/Colors";
import { DomainContext } from "../stores/DomainStore";
import { RootStackScreenProps } from "../types";

function RootScreen({ navigation }: RootStackScreenProps<"App">) {
  const domain = React.useContext(DomainContext);
  const theme = useTheme<CustomTheme>();

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  // Returns the login screen for mobile
  const MobileUnauthenticated = () => (
    <Container displayFlex flexOne safe style={styles.rootContainer}>
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
          <Button mode="contained" style={styles.button} onPress={handleLogin}>
            {t("root:ACTION_MOBILE_LOGIN")}
          </Button>
        </Container>
      </Container>
    </Container>
  );

  React.useEffect(() => {
    if (domain.account.isAuthenticated) return navigation.navigate("Channels");
  }, []);

  return Platform.isMobile ? <MobileUnauthenticated /> : null;
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

export default observer(RootScreen);
