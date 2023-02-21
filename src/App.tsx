import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
// import {Platform} from 'react-native';
import {I18nManager} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Globals} from './Components/Globals';
import SplashScreen from './Components/SplashScreen';
import {CombinedDarkTheme, CombinedLightTheme} from './constants/Colors';
import useColorScheme from './hooks/useColorScheme';
import useLogger from './hooks/useLogger';
import {RootNavigator} from './navigation';
import linking from './navigation/LinkingConfiguration';
import {DomainContext} from './stores/DomainStore';
import i18n from './utils/i18n';

// Platform.isDesktop = Platform.OS === 'macos' || Platform.OS === 'windows';
// Platform.isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
// Platform.isWeb = Platform.OS === 'web';

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
        domain.account.loadToken(domain);
      } catch (e) {
        logger.warn(e);
      } finally {
        domain.setAppLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <PaperProvider
          theme={domain.isDarkTheme ? CombinedDarkTheme : CombinedLightTheme}>
          <NavigationContainer
            linking={linking}
            theme={domain.isDarkTheme ? CombinedDarkTheme : CombinedLightTheme}>
            {domain.isAppReady ? <RootNavigator /> : <SplashScreen />}
          </NavigationContainer>
        </PaperProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default Main;
