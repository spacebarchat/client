import {Snowflake} from '@puyodead1/fosscord-api-types/globals';
import {ChannelType} from '@puyodead1/fosscord-api-types/v9';
import {DomainStore} from '../stores/DomainStore';

function useChannel(
  domain: DomainStore,
  guildId: Snowflake,
  channelId: Snowflake | undefined,
) {
  const guild = domain.guilds.get(guildId);
  if (!guild) {
    return null;
  }

  // get the channel by id or return the first text based channel in the guild
  const channel = channelId
    ? guild.channels.get(channelId)
    : // TODO: make this nicer
      guild.channels
        .getAll()
        .find(
          x =>
            ![
              ChannelType.DM,
              ChannelType.GroupDM,
              ChannelType.VoicelessWhiteboard,
              ChannelType.GuildVoice,
              ChannelType.GuildStageVoice,
              ChannelType.GuildCategory,
              ChannelType.GuildDirectory,
              ChannelType.GuildStore,
            ].includes(x.type),
        );
  return channel;
}

export default useChannel;
