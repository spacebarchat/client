import { Box, FlatList, Avatar, Tooltip, Pressable } from "native-base";
import React from "react";
import client from "../../Client";
import { useCache } from "../../util/useCache";
import { Link } from "react-router-dom";
import { Guild } from "fosscord.js";

const Sidebar = () => {
  const guilds = useCache(client.guilds).array();

  return (
    <Box height="100%">
      <FlatList
        style={{ flexGrow: 0, height: "100%" }}
        m={1}
        data={guilds}
        renderItem={({ item }: { item: Guild }) => (
          <Link
            to={`/channels/${item?.id}/${
              item.channels.cache
                .filter(
                  (x) =>
                    // @ts-ignore
                    x.type === "GUILD_TEXT" &&
                    item.me?.permissionsIn(x).has("VIEW_CHANNEL")
                )
                .first()?.id
            }`}
            key={item.id}
          >
            <Tooltip label={item.name} placement={"right"}>
              <Avatar
                my={1}
                source={{
                  uri: item.iconURL({ size: 1024 }) as string,
                }}
                _text={{ color: "white" }}
                size={"sm"}
              >
                {!item.iconURL() && item?.nameAcronym}
              </Avatar>
            </Tooltip>
          </Link>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
};

export default Sidebar;
