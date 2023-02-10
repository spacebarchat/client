import React from "react";
import { StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { DomainContext } from "../stores/DomainStore";
import GuildStore from "../stores/GuildStore";
import Endpoints from "../utils/Endpoints";

import { Popable } from "react-native-popable";

interface GuildListGuildProps {
  guild: GuildStore;
}

function GuildListGuild({ guild }: GuildListGuildProps) {
  const domain = React.useContext(DomainContext);

  if (guild.icon) {
    return (
      <Popable
        content={guild.name}
        position="right"
        action="hover"
        style={{ zIndex: 100 }}
      >
        <Avatar.Image
          size={48}
          source={{
            uri: domain.rest.makeCDNUrl(
              Endpoints.GUILD_ICON(guild.id, guild.icon)
            ),
          }}
          style={[styles.guildIcon, { backgroundColor: "transparent" }]}
        />
      </Popable>
    );
  }

  return (
    <Popable
      content={guild.name}
      position="right"
      action="hover"
      style={{ zIndex: 100 }}
    >
      <Avatar.Text
        size={48}
        label={guild.name.slice(0, 1)}
        style={styles.guildIcon}
      />
    </Popable>
  );
}

const styles = StyleSheet.create({
  guildIcon: {
    marginVertical: 5,
  },
});

export default GuildListGuild;
