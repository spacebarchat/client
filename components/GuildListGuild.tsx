import React from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { Popable, usePopable } from "react-native-popable";
import { DomainContext } from "../stores/DomainStore";
import GuildStore from "../stores/GuildStore";
import Endpoints from "../utils/Endpoints";

interface GuildListGuildProps {
  guild: GuildStore;
  onPress?: () => void;
}

function GuildListGuild({ guild, onPress }: GuildListGuildProps) {
  const domain = React.useContext(DomainContext);
  const [ref, { hide, show }] = usePopable();

  const onHoverIn = () => {
    if (!Platform.isWeb) return;
    show();
  };

  const onHoverOut = () => {
    if (!Platform.isWeb) return;
    hide();
  };

  if (guild.icon) {
    return (
      <Popable
        content={guild.name}
        position="right"
        action="hover"
        style={{ zIndex: 100 }}
        ref={ref}
      >
        <Pressable
          onPress={onPress}
          onHoverIn={onHoverIn}
          onHoverOut={onHoverOut}
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
        </Pressable>
      </Popable>
    );
  }

  return (
    <Popable
      content={guild.name}
      position="right"
      action="hover"
      style={{ zIndex: 100 }}
      ref={ref}
    >
      <Pressable
        onPress={onPress}
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
      >
        <Avatar.Text
          size={48}
          label={guild.name.substring(0, 2).toUpperCase()}
          style={styles.guildIcon}
        />
      </Pressable>
    </Popable>
  );
}

const styles = StyleSheet.create({
  guildIcon: {
    marginVertical: 5,
  },
});

export default GuildListGuild;
