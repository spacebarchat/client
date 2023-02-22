import {NavigationContainer} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {I18nManager, Platform} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from './components/SplashScreen';
import {CombinedDarkTheme, CombinedLightTheme} from './constants/Colors';
import {Globals} from './constants/Globals';
import useColorScheme from './hooks/useColorScheme';
import useLogger from './hooks/useLogger';
import {RootNavigator} from './navigation';
import linking from './navigation/LinkingConfiguration';
import {DomainContext} from './stores/DomainStore';
import i18n from './utils/i18n';

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

  React.useEffect(() => {
    // TODO: try to get the theme from storage
    domain.setDarkTheme(colorScheme === 'dark');

    const init = async () => {
      try {
        // load "constant" globals
        await Globals.init();

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

            domain.setI18NInitialized();
          })
          .catch(e => {
            logger.warn('Something went wrong while initializing i18n:', e);
          });

        // load token from storage
        await domain.account.loadToken(domain);
      } catch (e) {
        logger.warn(e);
      } finally {
        logger.debug('Loading complete');
        domain.setAppLoading(false);
      }
    };

    init();
  }, []);

  const theme = domain.isDarkTheme ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <PaperProvider theme={theme}>
            <NavigationContainer linking={linking} theme={theme}>
              {domain.isAppReady ? <RootNavigator /> : <SplashScreen />}
            </NavigationContainer>
          </PaperProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default observer(Main);
