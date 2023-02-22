import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton, Modal, Portal, Text, useTheme} from 'react-native-paper';
import Container from '../../../components/Container';
import {CustomTheme} from '../../../types';

function Settings() {
  const navigation = useNavigation();
  const theme = useTheme<CustomTheme>();

  const closeModal = () => {
    navigation.goBack();
  };

  return (
    <Portal>
      <Modal
        visible
        onDismiss={closeModal}
        style={[
          styles.modal,
          {backgroundColor: theme.colors.palette.neutral50},
        ]}
        contentContainerStyle={[styles.contentContainer]}>
        <Container flexOne>
          <Container style={{position: 'absolute', top: 0, right: 0}}>
            <IconButton mode="contained" icon="close" onPress={closeModal} />
          </Container>

          <Text>Settings</Text>
        </Container>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {},
  contentContainer: {
    flex: 1,
    margin: 40,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    // justifyContent: 'center',
    // alignContent: 'center',
  },
});

export default observer(Settings);
