import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import Container from './Container';

function SplashScreen() {
  return (
    <Container style={styles.container} horizontalCenter verticalCenter>
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
