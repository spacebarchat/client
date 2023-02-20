import React from 'react';
// import {Platform} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import {Provider as PaperProvider, Text} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Container from './Components/Container';
import SplashScreen from './Components/SplashScreen';
import {CombinedDarkTheme, CombinedLightTheme} from './constants/Colors';
import useColorScheme from './hooks/useColorScheme';
import {DomainContext} from './stores/DomainStore';

// Platform.isDesktop = Platform.OS === 'macos' || Platform.OS === 'windows';
// Platform.isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
// Platform.isWeb = Platform.OS === 'web';

function App() {
  const [isAppLoading, setAppLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setAppLoading(false);
    }, 3000);
  }, []);

  if (isAppLoading) {
    return <SplashScreen />;
  }

  return (
    <Container>
      <Text>Test</Text>
    </Container>
  );
}

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

  React.useEffect(() => {
    // TODO: try to get the theme from storage
    domain.setDarkTheme(colorScheme === 'dark');
  });

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <PaperProvider
          theme={domain.isDarkTheme ? CombinedDarkTheme : CombinedLightTheme}>
          <App />
        </PaperProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

export default Main;
