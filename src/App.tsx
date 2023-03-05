import {NavigationContainer} from '@react-navigation/native';
import {reaction} from 'mobx';
import {observer} from 'mobx-react';
import React from 'react';
import FPSStats from 'react-fps-stats';
import {I18nManager, Platform, useColorScheme} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeName} from './constants/Colors';
import {Globals} from './constants/Globals';
import useLogger from './hooks/useLogger';
import {RootNavigator} from './navigation';
import linking from './navigation/LinkingConfiguration';
import {DomainContext} from './stores/DomainStore';
import i18n from './utils/i18n';
import {localeLogger} from './utils/i18n/locale-detector';

Platform.isDesktop = Platform.OS === 'macos' || Platform.OS === 'windows';
Platform.isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
Platform.isWeb = Platform.OS === 'web';
Platform.isWindows = Platform.OS === 'windows';

function Main() {
  // if (
  //   !new (class {
  //     x: any;
  //   })().hasOwnProperty('x')
  // ) {
  //   throw new Error('Transpiler is not configured correctly');
  // }

  const domain = React.useContext(DomainContext);
  const colorScheme = useColorScheme();
  const logger = useLogger('App');

  // handles changes to the system theme
  React.useEffect(
    () => domain.setTheme(colorScheme as ThemeName),
    [colorScheme],
  );

  // handles the initial loading of the app
  React.useEffect(() => {
    const init = async () => {
      try {
        // domain.loadTheme();

        // load "constant" globals
        await Globals.load();

        // initialize localization
        await i18n
          .init()
          .then(() => {
            const RNDir = I18nManager.isRTL ? 'RTL' : 'LTR';
            // RN doesn't always correctly identify native
            // locale direction, so we force it here.
            if (i18n.dir !== RNDir) {
              const isLocaleRTL = i18n.dir === 'RTL';
              I18nManager.forceRTL(isLocaleRTL);
              // RN won't set the layout direction if we
              // don't restart the app's JavaScript.
              // TODO: how do we reload the app?
            }

            localeLogger.info('I18n initialized');
          })
          .catch(e => {
            logger.warn('Something went wrong while initializing i18n:', e);
          });

        await domain.loadToken();
      } catch (e) {
        logger.warn(e);
      } finally {
        logger.debug('Loading complete');
        domain.setAppLoading(false);
      }
    };

    init();
  }, []);

  // Handles gateway connection/disconnection on token change
  reaction(
    () => domain.token,
    value => {
      if (value) {
        if (domain.gateway.readyState === WebSocket.CLOSED) {
          domain.setGatewayReady(false);
          domain.gateway.connect(Globals.routeSettings.gateway);
        } else {
          logger.debug('Gateway connect called but socket is not closed');
        }
      } else {
        if (domain.gateway.readyState === WebSocket.OPEN) {
          domain.gateway.disconnect(1000, 'user is no longer authenticated');
        }
      }
    },
    {
      fireImmediately: true,
    },
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <PaperProvider theme={domain.theme}>
            <NavigationContainer linking={linking} theme={domain.theme}>
              {__DEV__ && domain.showFPS && Platform.isWeb && <FPSStats />}
              <RootNavigator />
            </NavigationContainer>
          </PaperProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default observer(Main);
