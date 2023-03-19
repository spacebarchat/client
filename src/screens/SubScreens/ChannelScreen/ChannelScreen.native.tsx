import {runInAction} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import ChannelHeader from '../../../components/ChannelHeader';
import ChannelsSidebar from '../../../components/ChannelsSidebar';
import Container from '../../../components/Container';
import GuildsSidebar from '../../../components/GuildsSidebar';
import MessageInput from '../../../components/Messaging/MessageInput';
import MessageList from '../../../components/Messaging/MessageList';
import Swiper from '../../../components/Swiper';
import useChannel from '../../../hooks/useChannel';
import useGuild from '../../../hooks/useGuild';
import useLogger from '../../../hooks/useLogger';
import {DomainContext} from '../../../stores/DomainStore';
import {ChannelsStackScreenProps, CustomTheme} from '../../../types';

function ChannelScreen({
  navigation,
  route: {
    params: {guildId, channelId},
  },
}: ChannelsStackScreenProps<'Channel'>) {
  const theme = useTheme<CustomTheme>();
  const logger = useLogger('ChannelScreen');
  const domain = React.useContext(DomainContext);
  const guild = useGuild(guildId);
  const channel = useChannel(domain, guildId, channelId);

  // handles updating the channel id parameter when switching guilds
  React.useEffect(() => {
    if (guildId === 'me') {
      return;
    }

    if (!channel) {
      logger.warn(
        `Channel was undefined for guild ${guildId} and channel ${channelId}`,
      );
      return;
    }

    navigation.setParams({
      channelId: channel.id,
    });

    runInAction(() => {
      channel.getMessages(domain, true);
    });
  }, [guildId, channelId]);

  const leftAction = (
    <Container row>
      <GuildsSidebar />
      <ChannelsSidebar guildId={guildId} />
    </Container>
  );

  const rightAction = (
    <Container>
      <Text>Right Action</Text>
    </Container>
  );

  return (
    <Swiper leftChildren={leftAction} rightChildren={rightAction}>
      <ChannelHeader title={channel?.name ?? 'Unknown Channel'} />
      {channel && <MessageList channel={channel} />}
      {channel && <MessageInput channel={channel} />}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default observer(ChannelScreen);
