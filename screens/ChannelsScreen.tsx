import { CommonActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  SectionList,
  View,
} from "react-native";
import { Avatar, Button, Text, useTheme } from "react-native-paper";
import Container from "../components/Container";
import GuildListGuild from "../components/GuildListGuild";
import Swiper from "../components/Swiper";
import { CustomTheme } from "../constants/Colors";
import useChannel from "../hooks/useChannel";
import useGuild from "../hooks/useGuild";
import { DomainContext } from "../stores/DomainStore";
import {
  ChannelsParamList,
  ChannelsStackScreenProps,
  RootStackScreenProps,
} from "../types";

const sectionPlaceholderData = [
  {
    title: "Section 1",
    data: ["member1", "member2", "member3", "member4", "member4"],
  },
  {
    title: "Section 2",
    data: ["member1", "member2", "member3", "member4", "member4"],
  },
  {
    title: "Section 3",
    data: ["member1", "member2", "member3", "member4", "member4"],
  },
  {
    title: "Section 4",
    data: ["member1", "member2", "member3", "member4", "member4"],
  },
];

const Stack = createNativeStackNavigator<ChannelsParamList>();

const Home = observer(() => {
  return (
    <Container>
      <Text>Home</Text>
    </Container>
  );
});

const ChannelDesktop = observer(
  ({
    route: {
      params: { guildId, channelId },
    },
    navigation,
  }: ChannelsStackScreenProps<"Channel">) => {
    const theme = useTheme<CustomTheme>();
    const domain = React.useContext(DomainContext);
    const guild = useGuild(guildId, domain);
    const channel = useChannel(guildId, channelId, domain);

    React.useEffect(() => {
      if (!channelId && channel) {
        // get the first channel in the guild and update the route params
        channelId = channel.id;
        navigation.dispatch(CommonActions.setParams({ channelId: channel.id }));
      }
    }, [channelId, channel]);

    if (!guild) {
      return (
        <Container>
          <Text>Guild not found</Text>
        </Container>
      );
    }

    if (!channel) {
      return (
        <Container>
          <Text>
            Could not find channel by id, or could not get the first channel in
            the guild
          </Text>
        </Container>
      );
    }

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
          <Container
            testID="chatHeader"
            verticalCenter
            horizontalCenter
            style={{
              height: 48,
              backgroundColor: theme.colors.palette.backgroundPrimary70,
            }}
            isSurface
            elevation={1}
          >
            <Text>{guild.name}</Text>
          </Container>
          <Container displayFlex flexOne>
            <ScrollView style={{ padding: 10 }}>
              {Array.from(guild.channels.channels.values()).map((channel) => (
                <Text key={channel.id}>{channel.name}</Text>
              ))}
            </ScrollView>
          </Container>
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
          <Container
            testID="chatHeader"
            verticalCenter
            style={{
              height: 48,
              paddingHorizontal: 10,
              backgroundColor: theme.colors.palette.backgroundPrimary100,
            }}
            isSurface
            elevation={1}
          >
            <Text>#{channel.name}</Text>
          </Container>
          <Container testID="chat" displayFlex flexOne row>
            <Container testID="chatContent" displayFlex flexOne>
              <ScrollView style={{ padding: 10 }}>
                <Button mode="contained" onPress={domain.toggleDarkTheme}>
                  Theme
                </Button>
                <Button
                  mode="contained"
                  onPress={domain.account.logout}
                  buttonColor={theme.colors.error}
                >
                  Logout
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
              <SectionList
                sections={sectionPlaceholderData}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                  <View
                    style={{
                      marginVertical: 20,
                      padding: 10,
                    }}
                  >
                    <Text>{item}</Text>
                  </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View
                    style={{
                      backgroundColor: theme.colors.palette.backgroundPrimary70,
                      padding: 20,
                    }}
                  >
                    <Text>{title}</Text>
                  </View>
                )}
                stickySectionHeadersEnabled={true}
                contentContainerStyle={{ padding: 10 }}
              />
            </Container>
          </Container>
        </Container>
      </Container>
    );
  }
);

const ChannelMobile = observer(
  ({
    route: {
      params: { guildId, channelId },
    },
    navigation,
  }: ChannelsStackScreenProps<"Channel">) => {
    const theme = useTheme<CustomTheme>();
    const domain = React.useContext(DomainContext);
    const guild = useGuild(guildId, domain);
    const channel = useChannel(guildId, channelId, domain);

    React.useEffect(() => {
      if (!channelId && channel) {
        // get the first channel in the guild and update the route params
        channelId = channel.id;
        navigation.dispatch(CommonActions.setParams({ channelId: channel.id }));
      }
    }, [channelId, channel]);

    return (
      <Container
        flexOne
        displayFlex
        verticalCenter
        horizontalCenter
        style={{
          backgroundColor: theme.colors.palette.backgroundPrimary90,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        {!guild ? (
          <Text>Guild not found</Text>
        ) : !channel ? (
          <Text>Channel not found</Text>
        ) : (
          <>
            <Text style={{ color: "red" }}>Guild: {guildId}</Text>
            <Text style={{ color: "red" }}>Channel: {channelId}</Text>
          </>
        )}
      </Container>
    );
  }
);

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
            backgroundColor: theme.colors.palette.backgroundPrimary40,
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
                  params: { guildId: "me" },
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
                        params: { guildId: guild.id },
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
              initialParams={{ guildId: "me" }}
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
    const theme = useTheme<CustomTheme>();

    const leftAction = (
      <Container flexOne row>
        <Container
          style={{
            width: 72,
            backgroundColor: theme.colors.palette.backgroundPrimary40,
          }}
        >
          <ScrollView>
            <Pressable
              onPress={() => {
                navigation.navigate("Channels", {
                  screen: "Channel",
                  params: { guildId: "me" },
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
                        params: { guildId: guild.id },
                      });
                    }}
                  />
                );
              })}
            </Container>
          </ScrollView>
        </Container>
        <Container
          testID="channelSidebar"
          flexOne
          style={{
            backgroundColor: theme.colors.palette.backgroundPrimary70,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <Container
            testID="chatHeader"
            verticalCenter
            horizontalCenter
            style={{
              height: 74,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: theme.colors.palette.backgroundPrimary70,
            }}
            isSurface
            elevation={1}
          >
            <Text>Channel Header</Text>
          </Container>
          <Container testID="channelSidebarBody" flexOne>
            <SectionList
              style={{ margin: 10 }}
              sections={sectionPlaceholderData}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => (
                <View style={{ marginVertical: 20, padding: 10 }}>
                  <Text>{item}</Text>
                </View>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View
                  style={{
                    backgroundColor: theme.colors.palette.backgroundPrimary70,
                    padding: 20,
                  }}
                >
                  <Text>{title}</Text>
                </View>
              )}
              stickySectionHeadersEnabled={true}
              contentContainerStyle={{ padding: 10 }}
            />
          </Container>
        </Container>
      </Container>
    );

    const rightAction = (
      <Container
        flexOne
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backgroundColor: theme.colors.palette.backgroundPrimary70,
        }}
      >
        <Container
          verticalCenter
          horizontalCenter
          style={{
            height: 74,
            padding: 10,
          }}
        >
          <Text>Member List Header</Text>
        </Container>
        <Container
          verticalCenter
          style={{
            padding: 10,
            backgroundColor: theme.colors.palette.backgroundPrimary100,
          }}
        >
          <SectionList
            sections={sectionPlaceholderData}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <View style={{ marginVertical: 20, padding: 10 }}>
                <Text>{item}</Text>
              </View>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View
                style={{
                  backgroundColor: theme.colors.palette.backgroundPrimary100,
                  padding: 20,
                }}
              >
                <Text>{title}</Text>
              </View>
            )}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={{ padding: 10 }}
          />
        </Container>
      </Container>
    );

    const footer = (
      <Container
        flexOne
        displayFlex
        verticalCenter
        horizontalCenter
        row
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          zIndex: 10,
          minHeight: 50,
          backgroundColor: theme.colors.palette.backgroundPrimary0,
        }}
      >
        <Button mode="contained" onPress={domain.toggleDarkTheme}>
          Toggle Theme
        </Button>
        <Button
          mode="contained"
          onPress={domain.account.logout}
          buttonColor={theme.colors.error}
        >
          Logout
        </Button>
      </Container>
    );

    return (
      <Swiper
        footerChildren={footer}
        leftChildren={leftAction}
        rightChildren={rightAction}
        containerStyle={{
          backgroundColor: theme.colors.palette.backgroundPrimary40,
        }}
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
            initialParams={{ guildId: "me" }}
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
