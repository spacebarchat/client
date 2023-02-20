import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Container from './Container';

function SplashScreen() {
  return (
    <Container
      style={styles.container}
      horizontalCenter
      verticalCenter
      element={SafeAreaView}>
      <ActivityIndicator size="large" />
      <Text>Fosscord</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SplashScreen;
