import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {useTheme} from 'react-native-paper';
import {CustomTheme} from '../types';

function Hr(props: ViewProps) {
  const theme = useTheme<CustomTheme>();

  return (
    <View
      {...props}
      style={[
        styles.hr,
        {borderBottomColor: theme.colors.highlight},
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  hr: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Hr;
