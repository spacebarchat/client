import { observer } from "mobx-react";
import React from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { Popable, usePopable } from "react-native-popable";
import GuildStore from "../stores/Guild";
import { CDNRoutes } from "../utils/Endpoints";
import REST from "../utils/REST";

interface GuildListGuildProps {
  guild: GuildStore;
  onPress?: () => void;
}

function GuildListGuild({ guild, onPress }: GuildListGuildProps) {
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
              uri: REST.makeCDNUrl(CDNRoutes.guildIcon(guild.id, guild.icon)),
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
          label={guild.name
            .split(" ")
            .map((word) => word.substring(0, 1))
            .join("")} // TODO: we should probably put a limit on this
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

export default observer(GuildListGuild);
