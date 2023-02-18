import { Snowflake } from "@puyodead1/fosscord-api-types/globals";
import { DomainStore } from "../stores/DomainStore";

function useChannel(
  guildId: Snowflake,
  channelId: Snowflake | undefined,
  domain: DomainStore
) {
  const guild = domain.guilds.get(guildId);
  if (!guild) return null;

  // get the channel by id or return the first channel in the guild
  const channel = channelId
    ? guild.channels.get(channelId)
    : Array.from(guild.channels.values())[0];
  return channel;
}

export default useChannel;
