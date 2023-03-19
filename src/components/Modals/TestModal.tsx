import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {useModal} from 'react-native-modalfy';
import {Button, Text} from 'react-native-paper';
import Container from '../Container';

const {width, height} = Dimensions.get('window');

function TestModal() {
  const {closeModal} = useModal();

  return (
    <Container style={styles.container}>
      <Text>This is a test modal</Text>
      <Text>You can click outside to close it or press the button below</Text>
      <Button mode="contained" onPress={() => closeModal('Test')}>
        Close Modal
      </Button>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212121',
    minHeight: height / 1.4,
    minWidth: width / 1.4,
  },
});

export default TestModal;
