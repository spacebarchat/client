import React from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import {useModal} from 'react-native-modalfy';
import {Button, IconButton, Text} from 'react-native-paper';
import Container from '../Container';

const {width, height} = Dimensions.get('window');

function AddServerModal() {
  const {closeModal, openModal} = useModal();

  return (
    <Container style={styles.container} flex={1} horizontalCenter>
      <Container style={styles.closeButton}>
        <IconButton
          mode="contained"
          icon="close"
          onPress={() => closeModal('AddServer')}
        />
      </Container>

      <Container style={styles.headerContainer}>
        <Text variant="headlineLarge" style={styles.text}>
          Add a Server
        </Text>
        <Text variant="bodySmall" style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet risus
          nullam eget felis eget nunc.
        </Text>
      </Container>
      <Container row>
        <Button
          mode="contained"
          onPress={() => openModal('CreateGuild')}
          style={styles.actionButton}>
          Create Guild
        </Button>
        <Button
          mode="contained"
          onPress={() => openModal('JoinGuild')}
          style={styles.actionButton}>
          Join Guild
        </Button>
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212121',
    width: Platform.isMobile ? width : width / 4,
    borderRadius: 10,
    padding: 10,
  },
  headerContainer: {
    marginBottom: 30,
  },
  text: {
    textAlign: 'center',
  },
  actionButton: {
    marginHorizontal: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 5,
  },
});

export default AddServerModal;
