import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import React from "react";
import { Platform, Pressable, ScrollView } from "react-native";
import { Avatar, Button, Surface, Text, useTheme } from "react-native-paper";
import Container from "../components/Container";
import GuildListGuild from "../components/GuildListGuild";
import Swiper from "../components/Swiper";
import { CustomTheme } from "../constants/Colors";
import { DomainContext } from "../stores/DomainStore";
import {
  ChannelsParamList,
  ChannelsStackScreenProps,
  RootStackScreenProps,
} from "../types";

const Stack = createNativeStackNavigator<ChannelsParamList>();

const Home = observer(() => {
  return (
    <Container>
      <Text>Home</Text>
    </Container>
  );
});

const ChannelDesktop = observer(
  (props: ChannelsStackScreenProps<"Channel">) => {
    const theme = useTheme<CustomTheme>();
    const domain = React.useContext(DomainContext);

    return (
      <Container verticalCenter horizontalCenter flexOne displayFlex row>
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
    );
  }
);

const ChannelMobile = observer((props: ChannelsStackScreenProps<"Channel">) => {
  return (
    <Container
      flexOne
      displayFlex
      verticalCenter
      horizontalCenter
      style={{ backgroundColor: "yellow" }}
    >
      <Text style={{ color: "red" }}>Channel: {props.route.params.id}</Text>
    </Container>
  );
});

const ChannelsScreenDesktop = observer(
  ({ navigation }: RootStackScreenProps<"Channels">) => {
    const domain = React.useContext(DomainContext);
    const theme = useTheme<CustomTheme>();

    return (
      <Container verticalCenter horizontalCenter flexOne displayFlex row>
        <Container
          testID="guildsList"
          style={{
            height: "100%",
            backgroundColor: theme.colors.palette.backgroundPrimary60,
            width: 72,
            zIndex: 3,
          }}
          displayFlex
          horizontalCenter
        >
          <ScrollView style={{ overflow: "visible" }}>
            <Pressable
              onPress={() => {
                navigation.navigate("Channels", {
                  screen: "Channel",
                  params: { id: "me" },
                });
              }}
            >
              <Avatar.Icon icon="home" size={48} />
            </Pressable>

            <Container
              testID="guildListGuildIconContainer"
              style={{ overflow: "visible" }}
            >
              {Array.from(domain.guild.guilds.values()).map((guild) => {
                return (
                  <GuildListGuild
                    key={guild.id}
                    guild={guild}
                    onPress={() => {
                      navigation.navigate("Channels", {
                        screen: "Channel",
                        params: { id: guild.id },
                      });
                    }}
                  />
                );
              })}
            </Container>
          </ScrollView>
        </Container>

        <Container
          testID="outerContainer"
          style={{ height: "100%" }}
          displayFlex
          flexOne
          row
        >
          <Stack.Navigator
            initialRouteName="Channel"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="Channel"
              component={ChannelDesktop}
              initialParams={{ id: "me" }}
            />
          </Stack.Navigator>
        </Container>
      </Container>
    );
  }
);

const ChannelsScreenMobile = observer(
  ({ navigation }: RootStackScreenProps<"Channels">) => {
    const domain = React.useContext(DomainContext);

    const leftAction = (
      <Container flexOne row>
        <Container style={{ width: 72, backgroundColor: "blue" }}>
          <ScrollView>
            <Pressable
              onPress={() => {
                navigation.navigate("Channels", {
                  screen: "Channel",
                  params: { id: "me" },
                });
              }}
            >
              <Avatar.Icon icon="home" size={48} />
            </Pressable>

            <Container testID="guildListGuildIconContainer">
              {Array.from(domain.guild.guilds.values()).map((guild) => {
                return (
                  <GuildListGuild
                    key={guild.id}
                    guild={guild}
                    onPress={() => {
                      navigation.navigate("Channels", {
                        screen: "Channel",
                        params: { id: guild.id },
                      });
                    }}
                  />
                );
              })}
            </Container>
          </ScrollView>
        </Container>
        <Container flexOne style={{ backgroundColor: "green" }}>
          <Text>Left Action Channel List</Text>
        </Container>
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
        <Text>Footer</Text>
      </Container>
    );

    return (
      <Swiper
        footerChildren={footer}
        leftChildren={leftAction}
        rightChildren={rightAction}
      >
        <Stack.Navigator
          initialRouteName="Channel"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Channel"
            component={ChannelMobile}
            initialParams={{ id: "me" }}
          />
        </Stack.Navigator>
      </Swiper>
    );
  }
);

function ChannelsScreen(props: RootStackScreenProps<"Channels">) {
  const Element = Platform.isMobile
    ? ChannelsScreenMobile
    : ChannelsScreenDesktop;

  return <Element {...props} />;
}

export default observer(ChannelsScreen);
