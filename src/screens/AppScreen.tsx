import {observer} from 'mobx-react';
import React from 'react';
import {Platform} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import ChannelsSidebar from '../components/ChannelsSidebar';
import Container from '../components/Container';
import GuildsSidebar from '../components/GuildsSidebar';
import MembersSidebar from '../components/MembersSidebar';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme} from '../types';

function AppScreen() {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);

  const logout = () => {
    console.log('logout');
    domain.logout();
  };

  const showFps = () => {
    domain.setShowFPS(!domain.showFPS);
  };

  return (
    <Container row flex={1}>
      <GuildsSidebar />
      <ChannelsSidebar />

      <Container
        flex={1}
        style={{backgroundColor: theme.colors.palette.background70}}>
        <Text>Root Screen</Text>
        <Text>Guild Count: {domain.guilds.guildCount}</Text>
        <Text>User Count: {domain.users.userCount}</Text>

        {Platform.isWeb && __DEV__ && (
          <Button mode="contained" onPress={showFps}>
            Show FPS
          </Button>
        )}

        <Button mode="contained" onPress={logout}>
          Logout
        </Button>
      </Container>

      <MembersSidebar />
    </Container>
  );
}

export default observer(AppScreen);
