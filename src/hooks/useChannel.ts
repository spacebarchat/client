import {Snowflake} from '@puyodead1/fosscord-api-types/globals';
import {ChannelType} from '@puyodead1/fosscord-api-types/v9';
import {DomainStore} from '../stores/DomainStore';

function useChannel(
  guildId: Snowflake,
  channelId: Snowflake | undefined,
  domain: DomainStore,
) {
  const guild = domain.guilds.get(guildId);
  if (!guild) {
    return null;
  }

  // get the channel by id or return the first channel in the guild
  const channel = channelId
    ? guild.channels.get(channelId)
    : Array.from(guild.channels.values()).find(
        x => x.type === ChannelType.GuildText,
      ); // TODO: make this any Text based channel
  return channel;
}

export default useChannel;
