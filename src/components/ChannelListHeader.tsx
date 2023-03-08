import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Surface, useTheme} from 'react-native-paper';
import {CustomTheme} from '../types';
import Container from './Container';

interface Props {
  children: React.ReactNode;
}

function ChannelListheader({children}: Props) {
  const theme = useTheme<CustomTheme>();

  return (
    <Container
      horizontalCenter
      verticalCenter
      style={[
        styles.container,
        {backgroundColor: theme.colors.palette.background60},
      ]}
      element={Surface}
      elevation={1}>
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
  },
});

export default observer(ChannelListheader);
