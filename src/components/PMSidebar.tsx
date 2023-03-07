import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import Container from './Container';

function PMSidebar() {
  return (
    <Container style={styles.container}>
      <Text>PMSidebar</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: 240,
  },
});

export default observer(PMSidebar);
