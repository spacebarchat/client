import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
// import {Platform} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from './Components/SplashScreen';
import {CombinedDarkTheme, CombinedLightTheme} from './constants/Colors';
import useColorScheme from './hooks/useColorScheme';
import {RootNavigator} from './navigation';
import linking from './navigation/LinkingConfiguration';
import {DomainContext} from './stores/DomainStore';

// Platform.isDesktop = Platform.OS === 'macos' || Platform.OS === 'windows';
// Platform.isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
// Platform.isWeb = Platform.OS === 'web';

// function App() {
//   const [isAppLoading, setAppLoading] = React.useState(true);

//   React.useEffect(() => {
//     setTimeout(() => {
//       setAppLoading(false);
//     }, 3000);
//   }, []);

//   if (isAppLoading) {
//     return <SplashScreen />;
//   }

//   return (
//     <Container>
//       <Text>Test</Text>
//     </Container>
//   );
// }

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
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  React.useEffect(() => {
    // TODO: try to get the theme from storage
    domain.setDarkTheme(colorScheme === 'dark');

    setTimeout(() => {
      setLoadingComplete(true);
    }, 3000);
  });

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <PaperProvider
          theme={domain.isDarkTheme ? CombinedDarkTheme : CombinedLightTheme}>
          <NavigationContainer
            linking={linking}
            theme={domain.isDarkTheme ? CombinedDarkTheme : CombinedLightTheme}>
            {isLoadingComplete ? <RootNavigator /> : <SplashScreen />}
          </NavigationContainer>
        </PaperProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default Main;
