import React from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewProps } from "react-native";
import { Avatar } from "react-native-paper";
import { DomainContext } from "../stores/DomainStore";
import GuildStore from "../stores/GuildStore";
import Endpoints from "../utils/Endpoints";

interface GuildListGuildProps {
  guild: GuildStore;
}

function MyComponent(props: ViewProps) {
  const onLayout = (event: LayoutChangeEvent) => {
    console.log(event);
  };

  return (
    <View {...props} onLayout={onLayout}>
      {props.children}
    </View>
  );
}

function GuildListGuild({ guild }: GuildListGuildProps) {
  const domain = React.useContext(DomainContext);
  if (guild.icon) {
    return (
      <MyComponent>
        <Avatar.Image
          size={48}
          source={{
            uri: domain.rest.makeCDNUrl(
              Endpoints.GUILD_ICON(guild.id, guild.icon)
            ),
          }}
          style={[styles.guildIcon, { backgroundColor: "transparent" }]}
        />
      </MyComponent>
    );
  }

  return (
    <MyComponent>
      <Avatar.Text
        size={48}
        label={guild.name.slice(0, 1)}
        style={styles.guildIcon}
      />
    </MyComponent>
  );
}

const styles = StyleSheet.create({
  guildIcon: {
    marginVertical: 5,
  },
});

export default GuildListGuild;
