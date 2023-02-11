import { useContext } from "react";
import { Snowflake } from "../interfaces/common";
import { DomainContext } from "../stores/DomainStore";

function useChannel(guildId: Snowflake, channelId: Snowflake | undefined) {
  const domain = useContext(DomainContext);
  const guild = domain.guild.guilds.get(guildId);
  // get the channel by id or return the first channel in the guild
  const channel = channelId
    ? guild?.channels.channels.get(channelId)
    : guild?.channels.channels.values().next().value;
  return channel;
}

export default useChannel;
