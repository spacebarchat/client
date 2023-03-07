import {observer} from 'mobx-react';
import React from 'react';
import {Button, Text} from 'react-native-paper';
import Container from '../../components/Container';
import {DomainContext} from '../../stores/DomainStore';
import {ChannelsStackScreenProps} from '../../types';

function ChannelScreen({
  route: {
    params: {guildId, channelId},
  },
}: ChannelsStackScreenProps<'Channel'>) {
  const domain = React.useContext(DomainContext);

  // const logout = () => {
  //   console.log('logout');
  //   domain.logout();
  // };

  const showFps = () => {
    domain.setShowFPS(!domain.showFPS);
  };

  return (
    <Container>
      <Text>Guild ID: {guildId}</Text>
      <Text>Channel ID: {channelId}</Text>
      <Button mode="contained" onPress={showFps}>
        Show FPS
      </Button>
    </Container>
  );
}

export default observer(ChannelScreen);
