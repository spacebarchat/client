import { observer } from "mobx-react";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import Container from "../components/Container";
import Swiper from "../components/Swiper";
import { CustomTheme } from "../constants/Colors";
import { DomainContext } from "../stores/DomainStore";
import { RootStackScreenProps } from "../types";
import { t } from "../utils/i18n";

function RootScreen({ navigation }: RootStackScreenProps<"App">) {
  const domain = React.useContext(DomainContext);
  const theme = useTheme<CustomTheme>();

  React.useEffect(() => {
    // if the user is not logged in, redirect to the login screen
    if (
      !domain.account.isAuthenticated &&
      !Platform.isMobile &&
      !domain.devSkipAuth
    ) {
      navigation.navigate("Login");
    }
  }, []);

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

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

  const MobileAuthenticated = () => {
    const leftAction = (
      <Container verticalCenter horizontalCenter flexOne>
        <Text>Left Action</Text>
      </Container>
    );

    const rightAction = (
      <Container verticalCenter horizontalCenter flexOne>
        <Text>Right Action</Text>
      </Container>
    );

    const footer = (
      <Container
        flexOne
        displayFlex
        verticalCenter
        horizontalCenter
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 10,
          minHeight: 50,
          backgroundColor: "orange",
        }}
      >
        <Text>Mobile Footer</Text>
      </Container>
    );

    return (
      <Swiper
        footerChildren={footer}
        leftChildren={leftAction}
        rightChildren={rightAction}
      >
        <Container
          flexOne
          displayFlex
          verticalCenter
          horizontalCenter
          style={{ backgroundColor: "yellow" }}
        >
          <Text>Main Screen</Text>
        </Container>
      </Swiper>
    );
  };

  if (Platform.isMobile) {
    if (!domain.account.isAuthenticated && !domain.devSkipAuth)
      return MobileUnauthenticated();
    else return MobileAuthenticated();
  }

  return (
    <Container safe verticalCenter horizontalCenter flexOne displayFlex row>
      <Container
        testID="guildsList"
        style={{
          height: "100%",
          backgroundColor: theme.colors.palette.backgroundPrimary60,
          width: 72,
        }}
        displayFlex
        horizontalCenter
      >
        <ScrollView>
          {Array.from(domain.guild.guilds.values()).map((guild) => {
            return <Text key={guild.id}>{guild.name}</Text>;
          })}
        </ScrollView>
      </Container>

      <Container
        testID="outerContainer"
        style={{ height: "100%" }}
        displayFlex
        flexOne
        verticalCenter
        horizontalCenter
        row
      >
        <Container
          testID="channelList"
          style={{
            backgroundColor: theme.colors.palette.backgroundPrimary70,
            height: "100%",
            width: 240,
          }}
          displayFlex
        >
          <Surface
            testID="chatHeader"
            style={{
              height: 48,
              backgroundColor: theme.colors.palette.backgroundPrimary70,
            }}
            elevation={1}
          >
            <Text>Channel Header</Text>
          </Surface>
          <Text>Channel List</Text>
        </Container>

        <Container
          testID="chatContainer"
          style={{
            height: "100%",
            backgroundColor: theme.colors.palette.backgroundPrimary100,
          }}
          displayFlex
          flexOne
        >
          <Surface
            testID="chatHeader"
            style={{
              height: 48,
              backgroundColor: theme.colors.palette.backgroundPrimary100,
            }}
            elevation={1}
          >
            <Text>Chat Header</Text>
          </Surface>
          <Container testID="chat" displayFlex flexOne row>
            <Container testID="chatContent" displayFlex flexOne>
              <ScrollView>
                <Button onPress={domain.toggleDarkTheme}>
                  <Text>Theme</Text>
                </Button>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
                <Text style={{ marginVertical: 20 }}>Chat Content</Text>
              </ScrollView>
            </Container>
            <Container
              testID="memberList"
              style={{
                width: 240,
                backgroundColor: theme.colors.palette.backgroundPrimary70,
              }}
              displayFlex
            >
              <Text>Member List</Text>
            </Container>
          </Container>
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

export default observer(RootScreen);
