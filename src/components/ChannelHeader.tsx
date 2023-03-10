import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Surface, Text, useTheme} from 'react-native-paper';
import {CustomTheme} from '../types';
import Container from './Container';

interface Props {
  title: string;
}

function ChannelHeader({title}: Props) {
  const theme = useTheme<CustomTheme>();

  return (
    <Container
      verticalCenter
      horizontalCenter
      style={[
        styles.container,
        {backgroundColor: theme.colors.palette.background70},
      ]}
      element={Surface}
      elevation={1}>
      <Text>{title}</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    zIndex: 4,
  },
});

export default observer(ChannelHeader);
