import {observer} from 'mobx-react';
import React from 'react';
import {Surface, Text, useTheme} from 'react-native-paper';
import {CustomTheme} from '../constants/Colors';
import Channel from '../stores/objects/Channel';
import Container from './Container';

interface Props {
  channel: Channel;
}

function ChannelHeader({channel}: Props) {
  const theme = useTheme<CustomTheme>();

  return (
    <Container
      testID="chatHeader"
      verticalCenter
      horizontalCenter
      style={{
        height: 48,
        backgroundColor: theme.colors.palette.neutral60,
        zIndex: 110,
      }}
      element={Surface}
      elevation={2}>
      <Text>#{channel.name}</Text>
    </Container>
  );
}

export default observer(ChannelHeader);
