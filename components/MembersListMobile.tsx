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

function MembersListMobile({ guild }: Props) {
  const theme = useTheme<CustomTheme>();

  return (
    <Container
      testID="memberListContainer"
      flexOne
      style={{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: theme.colors.palette.backgroundPrimary70,
      }}
    >
      <Container
        testID="memberListHeader"
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
        testID="memberListListContainer"
        verticalCenter
        flexOne
        style={{
          padding: 10,
          backgroundColor: theme.colors.palette.backgroundPrimary100,
        }}
      >
        <SectionList
          testID="memberListList"
          sections={guild?.memberList?.listData || []}
          keyExtractor={(item, index) => index + item.user!.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.user?.username}</Text>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View
              style={{
                backgroundColor: theme.colors.palette.backgroundPrimary100,
                paddingTop: 10,
              }}
            >
              <Text
                style={{
                  color: theme.colors.textMuted,
                }}
              >
                {title}
              </Text>
            </View>
          )}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{
            padding: 10,
          }}
        />
      </Container>
    </Container>
  );
}

export default observer(MembersListMobile);
