import React from 'react';
import {StyleSheet} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import Container from '../components/Container';
import {CustomTheme} from '../types';

function SplashScreen() {
  const theme = useTheme<CustomTheme>();

  return (
    <Container
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      horizontalCenter
      verticalCenter>
      <ActivityIndicator size="large" />
      <Text variant="headlineLarge">Fosscord</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SplashScreen;
