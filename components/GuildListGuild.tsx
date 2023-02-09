import React from "react";
import { StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { DomainContext } from "../stores/DomainStore";
import GuildStore from "../stores/GuildStore";
import Endpoints from "../utils/Endpoints";

interface GuildListGuildProps {
  guild: GuildStore;
}

function GuildListGuild({ guild }: GuildListGuildProps) {
  const domain = React.useContext(DomainContext);

  if (guild.icon) {
    return (
      <Avatar.Image
        size={48}
        source={{
          uri: domain.rest.makeCDNUrl(
            Endpoints.GUILD_ICON(guild.id, guild.icon)
          ),
        }}
        style={[styles.guildIcon, { backgroundColor: "transparent" }]}
      />
    );
  }

  return (
    <Avatar.Text
      size={48}
      label={guild.name.slice(0, 1)}
      style={styles.guildIcon}
    />
  );
}

const styles = StyleSheet.create({
  guildIcon: {
    marginVertical: 5,
  },
});

export default GuildListGuild;
