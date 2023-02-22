import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import Container from '../components/Container';
import {RootStackScreenProps} from '../types';
import {t} from '../utils/i18n';

function NotFoundScreen({navigation}: RootStackScreenProps<'NotFound'>) {
  return (
    <Container flexOne verticalCenter horizontalCenter style={{padding: 20}}>
      <Text style={styles.title}>{t('notfound:TITLE')}</Text>
      <TouchableRipple
        onPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.replace('App')
        }
        style={styles.link}>
        <Text style={styles.linkText}>
          {t(navigation.canGoBack() ? 'notfound:GO_BACK' : 'notfound:GO_HOME')}
        </Text>
      </TouchableRipple>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

export default observer(NotFoundScreen);
