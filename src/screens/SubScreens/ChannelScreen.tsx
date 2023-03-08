import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import ChannelHeader from '../../components/ChannelHeader';
import ChannelsSidebar from '../../components/ChannelsSidebar';
import Container from '../../components/Container';
import MembersSidebar from '../../components/MembersSidebar';
import useGuild from '../../hooks/useGuild';
import {DomainContext} from '../../stores/DomainStore';
import {ChannelsStackScreenProps, CustomTheme} from '../../types';

function ChannelScreen({
  route: {
    params: {guildId, channelId},
  },
}: ChannelsStackScreenProps<'Channel'>) {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);
  const guild = useGuild(guildId);

  const showFps = () => {
    domain.setShowFPS(!domain.showFPS);
  };

  React.useEffect(() => {
    // TODO: update channel id
    console.log(guildId, channelId);
  }, [guildId, channelId]);

  return (
    <Container flex={1} row>
      <ChannelsSidebar guildId={guildId} />
      <Container flex={1}>
        <ChannelHeader />
        <Container
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
        </Container>
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
