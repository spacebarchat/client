import React from 'react';
import {
  Button as PaperButton,
  ButtonProps as PaperButtonProps,
} from 'react-native-paper';

function Button(props: PaperButtonProps) {
  return <PaperButton {...props} style={[{borderRadius: 5}, props.style]} />;
}

export default Button;
