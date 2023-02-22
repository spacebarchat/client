import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {observer} from 'mobx-react';
import React from 'react';
import {Animated} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomTabBar from '../../../components/ReactNavigationBottomTabs/views/BottomTabBar';
import {CustomTheme} from '../../../constants/Colors';
import BottomTabBarProgressContext from '../../../contexts/BottomTabBarProgressContext';
import {ChannelsParamList} from '../../../types';
import ChannelScreen from '../channel/ChannelScreen';
import Settings from '../settings/Settings';

const Tab = createBottomTabNavigator<ChannelsParamList>();

function ChannelsScreen() {
  const theme = useTheme<CustomTheme>();

  return (
    <BottomTabBarProgressContext.Provider
      value={{
        progress: new Animated.Value(0),
        setProgress: (progress: number) => {},
      }}>
      <Tab.Navigator
        initialRouteName="Channel"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.palette.neutral40,
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
    </BottomTabBarProgressContext.Provider>
  );
}

export default observer(ChannelsScreen);
