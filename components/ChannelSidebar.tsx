import {
	useTheme,
	Text,
	Avatar
} from "react-native-paper";
import Container from "./Container";
import { CustomTheme } from "../constants/Colors";
import {
	ScrollView,
	SectionList,
	View,
} from "react-native";
import { DomainContext } from "../stores/DomainStore";
import React from "react";
import useGuild from "../hooks/useGuild";
import GuildStore from "../stores/GuildStore";

interface Props {
	guild: GuildStore
}

const ChannelSidebar = ({ guild }: Props) => {
	const theme = useTheme<CustomTheme>();
	const domain = React.useContext(DomainContext);

	return (
		<Container
          testID="channelSidebar"
          style={{
            backgroundColor: theme.colors.palette.backgroundPrimary70,
            height: "100%",
            width: 240,
          }}
        >
          <Container testID="channelsWrapper" displayFlex flexOne>
            <Container
              testID="channelHeader"
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
                <SectionList
                  sections={guild.channelList}
                  keyExtractor={(item, index) => item.id + index}
                  renderItem={({ item }) => (
                    <View style={{ marginHorizontal: 10 }}>
                      <Text>#{item.name}</Text>
                    </View>
                  )}
                  renderSectionHeader={({ section: { title } }) => {
                    if (!title) return null;
                    return (
                      <View
                        style={{
                          backgroundColor:
                            theme.colors.palette.backgroundPrimary70,
                        }}
                      >
                        <Text>{title.toUpperCase()}</Text>
                      </View>
                    );
                  }}
                  stickySectionHeadersEnabled={true}
                  contentContainerStyle={{ padding: 10 }}
                />
              </ScrollView>
            </Container>
          </Container>
          <Container
            testID="channelFooter"
            style={{
              backgroundColor: theme.colors.palette.backgroundPrimary50,
            }}
          >
            <Container
              testID="userActions"
              displayFlex
              row
              horizontalCenter
              style={{
                height: 52,
                paddingVertical: 8,
                backgroundColor: "transparent",
              }}
            >
              <Container style={{ marginHorizontal: 8 }}>
                <Avatar.Image
                  size={32}
                  source={{ uri: domain.account.user?.avatarURL }}
                />
              </Container>
              <Container>
                <Text>
                  {domain.account.user?.username}#
                  {domain.account.user?.discriminator}
                </Text>
              </Container>
            </Container>
          </Container>
        </Container>
	)
}

export default ChannelSidebar;