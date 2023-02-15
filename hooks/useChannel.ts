import { Snowflake } from "../interfaces/common";
import ChannelStore from "../stores/ChannelStore";
import { DomainStore } from "../stores/DomainStore";

function useChannel(
  guildId: Snowflake,
  channelId: Snowflake | undefined,
  domain: DomainStore
) {
  const guild = domain.guilds.guilds.get(guildId);
  // get the channel by id or return the first channel in the guild
  const channel = channelId
    ? guild?.channels.channels.get(channelId)
    : (guild?.channels.channels.values().next().value as ChannelStore);
  return channel;
}

export default useChannel;
