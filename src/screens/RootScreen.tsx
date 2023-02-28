import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import Button from '../components/Button';
import Container from '../components/Container';
import {RootStackScreenProps} from '../types';
import {t} from '../utils/i18n';

/**
 * The *landing* page for mobile when unauthenticated
 */
function RootScreen({navigation}: RootStackScreenProps<'Root'>) {
  const onLoginPress = () => {
    navigation.navigate('Login');
  };

  const onRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <Container style={styles.container} flex={1} horizontalCenter>
      <Container style={styles.headerContainer}>
        <Text variant="headlineMedium" style={[styles.headline, styles.text]}>
          {t('root:WELCOME_TITLE_MOBILE')}
        </Text>
        <Text variant="bodyMedium" style={styles.text}>
          {t('root:WELCOME_SUBTITLE_MOBILE')}
        </Text>
      </Container>

      <Container style={styles.actionContainer}>
        <Button
          mode="contained"
          style={styles.actionButton}
          onPress={onLoginPress}>
          {t('root:ACTION_MOBILE_LOGIN')}
        </Button>

        <Button
          mode="contained"
          style={styles.actionButton}
          onPress={onRegisterPress}>
          {t('root:ACTION_MOBILE_REGISTER')}
        </Button>

        <Button mode="contained" style={styles.actionButton} onPress={() => {}}>
          {t('root:ACTION_MOBILE_ROUTE_SETTINGS')}
        </Button>
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'flex-end',
  },
  headerContainer: {},
  actionContainer: {paddingTop: 30, width: '100%', justifyContent: 'center'},
  headline: {
    fontWeight: '600',
  },
  text: {
    textAlign: 'center',
    margin: 5,
  },
  actionButton: {
    marginVertical: 5,
  },
});

export default observer(RootScreen);
