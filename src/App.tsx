import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import SplashScreen from './Components/SplashScreen';

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
    <View>
      <Text style={styles.test}>Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    color: 'white',
  },
});

function Main() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default Main;
