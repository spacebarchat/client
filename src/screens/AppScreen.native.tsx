import {observer} from 'mobx-react';
import React from 'react';
import {Platform} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import Container from '../components/Container';
import Swiper from '../components/Swiper';
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

  const leftAction = (
    <Container>
      <Text>Left Action</Text>
    </Container>
  );

  const rightAction = (
    <Container>
      <Text>Right Action</Text>
    </Container>
  );

  return (
    <Swiper leftChildren={leftAction} rightChildren={rightAction}>
      <Container flex={1} style={{backgroundColor: theme.colors.surface}}>
        <Text>Root Screen (Native)</Text>
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
    </Swiper>
  );
}

export default observer(AppScreen);
