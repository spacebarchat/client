import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {observer} from 'mobx-react';
import React from 'react';
import Container from '../components/Container';
import ContextMenu from '../components/ContextMenu/ContextMenu';
import GuildsSidebar from '../components/GuildsSidebar';
import {ContextMenuContext} from '../contexts/ContextMenuContext';
import {ChannelsParamList, RootStackScreenProps} from '../types';
import ChannelScreen from './SubScreens/ChannelScreen/ChannelScreen';

const Stack = createNativeStackNavigator<ChannelsParamList>();

function AppScreen({navigation}: RootStackScreenProps<'App'>) {
  const contextMenu = React.useContext(ContextMenuContext);

  return (
    <Container verticalCenter horizontalCenter row flex={1}>
      {/* TODO: replace with modal stack */}
      {contextMenu.visible && <ContextMenu {...contextMenu} />}
      <GuildsSidebar />

      <Container flex={1} row style={{height: '100%'}}>
        <Stack.Navigator
          initialRouteName="Channel"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Group>
            <Stack.Screen
              name="Channel"
              component={ChannelScreen}
              initialParams={{guildId: 'me'}}
            />
          </Stack.Group>
          {/* <Stack.Group screenOptions={{presentation: 'modal'}}>
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Group> */}
        </Stack.Navigator>
      </Container>
    </Container>
  );
}

export default observer(AppScreen);
