import { observer } from "mobx-react";
import React from "react";
import { SectionList, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../constants/Colors";
import GuildStore from "../stores/Guild";
import Container from "./Container";

interface Props {
  guild?: GuildStore;
}

function ChannelsSidebarMobile({ guild }: Props) {
  const theme = useTheme<CustomTheme>();

  return (
    <Container
      testID="channelsSidebarContainer"
      flexOne
      style={{
        backgroundColor: theme.colors.palette.backgroundPrimary70,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      <Container
        testID="channelsSidebarHeader"
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
        {/* TODO: private channels  */}
        <Text>{guild?.name}</Text>
      </Container>
      <Container testID="channelsSidebarList" flexOne>
        {/* TODO: private channels  */}
        <SectionList
          sections={guild?.channelList ?? []}
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
                  backgroundColor: theme.colors.palette.backgroundPrimary70,
                }}
              >
                <Text>{title.toUpperCase()}</Text>
              </View>
            );
          }}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{ padding: 10 }}
        />
      </Container>
    </Container>
  );
}

export default observer(ChannelsSidebarMobile);
