import {observer} from 'mobx-react';
import React from 'react';
import {Platform} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Container from '../components/Container';
import {DomainContext} from '../stores/DomainStore';

function AppScreen() {
  const domain = React.useContext(DomainContext);

  const logout = () => {
    console.log('logout');
    domain.logout();
  };

  const showFps = () => {
    domain.setShowFPS(!domain.showFPS);
  };

  return (
    <Container>
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
  );
}

export default observer(AppScreen);
