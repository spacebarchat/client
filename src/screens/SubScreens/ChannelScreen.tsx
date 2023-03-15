import {runInAction} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import ChannelHeader from '../../components/ChannelHeader';
import ChannelsSidebar from '../../components/ChannelsSidebar';
import Container from '../../components/Container';
import MembersSidebar from '../../components/MembersSidebar';
import MessageInput from '../../components/MessageInput.web';
import MessageList from '../../components/MessageList';
import useChannel from '../../hooks/useChannel';
import useGuild from '../../hooks/useGuild';
import useLogger from '../../hooks/useLogger';
import {DomainContext} from '../../stores/DomainStore';
import {ChannelsStackScreenProps, CustomTheme} from '../../types';

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

  const showFps = () => {
    domain.setShowFPS(!domain.showFPS);
  };

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

    domain.gateway.onChannelOpen(guildId, channel.id);

    runInAction(() => {
      channel.getChannelMessages(domain, true);
    });
  }, [guildId, channelId, channel]);

  return (
    <Container flex={1} row>
      <ChannelsSidebar guildId={guildId} />
      <Container flex={1}>
        <ChannelHeader title={channel?.name ?? 'Unknown Channel'} />
        {/* <Container
          flex={1}
          style={[
            styles.container,
            {backgroundColor: theme.colors.palette.background70},
          ]}>
          <Text>Channel Screen</Text>
          <Text>Guild ID: {guildId}</Text>
          <Text>Channel ID: {channelId ?? 'N/A'}</Text>
          <Text>Guild Count: {domain.guilds.count}</Text>
          <Text>User Count: {domain.users.count}</Text>
          <Text>Private Channel Count: {domain.privateChannels.count}</Text>
          <Text>Selected Guild Channel Count: {guild?.channels.count}</Text>
          <Text>Selected Guild Member Count: {guild?.memberCount}</Text>
          <Button mode="contained" onPress={showFps}>
            Show FPS
          </Button>
        </Container> */}
        {channel && <MessageList channel={channel} />}
        {channel && <MessageInput channel={channel} />}
      </Container>
      {guildId !== 'me' && <MembersSidebar />}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default observer(ChannelScreen);
