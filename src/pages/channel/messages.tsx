import {
  Box,
  FlatList,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
} from "native-base";
import React, { useEffect } from "react";
import { TextChannel } from "fosscord.js";
import Drawer from "../../components/Drawer";
import { relativeTime } from "../../util/Time";
import client from "../../Client";
import { Message } from "fosscord.js";

//TODO: Styling

export default function ({ match }: any) {
  const channel = client.channels.resolve(match.params.channel);
  const guild = client.guilds.resolve(match.params.guild);

  return (
    <Drawer channel={channel} guild={guild}>
      <RenderMessages channel={channel as TextChannel}></RenderMessages>
    </Drawer>
  );
}

function RenderMessages({ channel }: { channel: TextChannel }) {
  const [messages, setMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    channel?.messages?.fetch().then((msgs) => setMessages(msgs.array()));
  }, [channel]);

  if (!channel) return <Text>Please select a channel first</Text>;
  if (channel?.type !== "GUILD_TEXT") return <Text>Wrong Channel type</Text>;

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      // @ts-ignore
      renderItem={renderMessage}
    ></FlatList>
  );
}

export function renderMessage({
  index,
  item,
  seperators,
}: {
  index: number;
  item: Message;
  seperators: any;
}) {
  return (
    <Box
      style={{
        borderColor: "white",
        borderWidth: 1,
        height: "100%",
        width: "100%",
      }}
      key={item.id}
    >
      <Heading size="md">{item.author.username}</Heading>
      <Heading size="xs">{relativeTime(item.createdTimestamp)}</Heading>
      <Text>{item.content && item.content}</Text>
      <Text>{item.embeds && item.embeds.map((x: any) => <></>)}</Text>
      {item.attachments &&
        item.attachments.map((x: any) => (
          <Image
            style={{ height: x.height / 3, width: x.width / 3 }}
            alt="Test"
            source={{
              uri: x.url,
            }}
          />
        ))}
      {item.reactions && (
        <HStack>
          {item.reactions.cache?.map((x: any) => {
            return (
              <Box mx={2}>
                <Pressable>
                  <Text>{x.emoji.id ? x.emoji.id : x.emoji.name}</Text>
                </Pressable>
                <Text>{x.count}</Text>
              </Box>
            );
          })}
        </HStack>
      )}
      {item.embeds &&
        item.embeds.map((embed: any) => {
          return (
            <Box>
              <Heading size="xl">{embed.title}</Heading>
              <Text>{embed.description}</Text>
            </Box>
          );
        })}
    </Box>
  );
}
