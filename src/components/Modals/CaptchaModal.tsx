import React from 'react';
import {StyleSheet} from 'react-native';
import {ModalComponentProp} from 'react-native-modalfy';
import {ModalStackParamsList} from '../../utils/Modals';
import Container from '../Container';
import HCaptcha from '../HCaptcha';

function CaptchaModal({
  modal: {params},
}: ModalComponentProp<ModalStackParamsList, void, 'CaptchaModal'>) {
  const {captchaSiteKey, onMessage} = params!;

  return (
    <Container style={styles.container}>
      <HCaptcha siteKey={captchaSiteKey} onMessage={onMessage} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default CaptchaModal;
