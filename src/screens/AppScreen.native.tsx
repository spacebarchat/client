import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {observer} from 'mobx-react';
import React from 'react';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Container from '../components/Container';
import BottomTabBar from '../components/ReactNavigationBottomTabs/views/BottomTabBar';
import {DomainContext} from '../stores/DomainStore';
import {ChannelsParamList, CustomTheme} from '../types';
import ChannelScreen from './SubScreens/ChannelScreen/ChannelScreen';

const Tab = createBottomTabNavigator<ChannelsParamList>();

function Settings() {
  return (
    <Container>
      <Text>Settings</Text>
    </Container>
  );
}

function AppScreen() {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);

  return (
    <Tab.Navigator
      initialRouteName="Channel"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.palette.background40,
        },
        tabBarShowLabel: false,
      }}
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={props => <BottomTabBar {...props} />}>
      <Tab.Screen
        name="Channel"
        component={ChannelScreen}
        initialParams={{guildId: 'me'}}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color, size}) => (
            <Icon name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({color, size}) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default observer(AppScreen);
