/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {observer} from 'mobx-react';
import * as React from 'react';
import LoginScreen from '../screens/LoginScreen';
import RootScreen from '../screens/RootScreen';
import SplashScreen from '../screens/SplashScreen';
import {DomainContext} from '../stores/DomainStore';
import {RootStackParamsList} from '../types';

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamsList>();

export const RootNavigator = observer(() => {
  const domain = React.useContext(DomainContext);

  if (!domain.isAppReady) {
    return <SplashScreen />;
  }

  const unauthenticatedStack = (
    <>
      <Stack.Screen name="Login" component={LoginScreen} />
    </>
  );

  const authenticatedStack = (
    <>
      <Stack.Screen name="App" component={RootScreen} />
    </>
  );

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {domain.tokenLoaded && !domain.token
        ? unauthenticatedStack
        : authenticatedStack}
    </Stack.Navigator>
  );
});
