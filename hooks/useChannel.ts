import { Snowflake } from "@puyodead1/fosscord-api-types/globals";
import ChannelStore from "../stores/ChannelStore";
import { DomainStore } from "../stores/DomainStore";

function useChannel(
  guildId: Snowflake,
  channelId: Snowflake | undefined,
  domain: DomainStore
) {
  const guild = domain.guilds.get(guildId);
  // get the channel by id or return the first channel in the guild
  const channel = channelId
    ? guild?.channels.get(channelId)
    : (guild?.channels.values().next().value as ChannelStore);
  return channel;
}

export default useChannel;
