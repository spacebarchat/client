import React from "react";
import { Avatar, Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../constants/Colors";
import MessageStore from "../stores/MessageStore";
import { CDNRoutes, DefaultUserAvatarAssets } from "../utils/Endpoints";
import REST from "../utils/REST";
import Container from "./Container";

interface Props {
  message: MessageStore;
}

function ChatMessage({ message }: Props) {
  const theme = useTheme<CustomTheme>();

  return (
    <Container
      testID="messageContainer"
      key={message.id}
      row
      horizontalCenter
      style={{
        marginHorizontal: 10,
        paddingVertical: 10,
      }}
    >
      <Container testID="messageAvatarContainer">
        <Avatar.Image
          testID="messageAvatar"
          size={32}
          source={{
            uri: message.author?.avatar
              ? REST.makeCDNUrl(
                  CDNRoutes.userAvatar(message.author.id, message.author.avatar)
                )
              : "https://cdn.discordapp.com" +
                CDNRoutes.defaultUserAvatar(
                  (Number(message.author?.discriminator) %
                    5) as DefaultUserAvatarAssets
                ),
          }}
          style={{ backgroundColor: "transparent" }}
        />
      </Container>
      <Container
        testID="messageContentContainer"
        style={{
          marginLeft: 10,
          flex: 1,
        }}
      >
        <Container testID="messageHeaderContainer" row horizontalCenter>
          <Text
            testID="messageHeaderAuthor"
            style={{
              fontWeight: "500",
              fontSize: 16,
              color: theme.colors.whiteBlack,
            }}
          >
            {message.author?.username}
          </Text>
          <Text
            testID="messageHeaderTimestamp"
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: theme.colors.whiteBlack,
              marginLeft: 5,
            }}
          >
            {message.timestamp.toLocaleString()}
          </Text>
        </Container>
        <Container testID="messageContentContainer">
          <Text>{message.content}</Text>
        </Container>
      </Container>
    </Container>
  );
}

export default ChatMessage;
