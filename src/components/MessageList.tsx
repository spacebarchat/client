import {observer} from 'mobx-react';
import React from 'react';
import {FlatList} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Channel from '../stores/objects/Channel';
import {CustomTheme} from '../types';
import Container from './Container';

interface Props {
  channel: Channel;
}

function MessageList({channel}: Props) {
  const theme = useTheme<CustomTheme>();

  return (
    <Container
      style={{backgroundColor: theme.colors.palette.background70}}
      flex={1}>
      <FlatList
        data={channel.messages.getAll().map(x => ({id: x.id, item: x})) ?? []}
        renderItem={({item}) => (
          <Container>
            <Text>{item.item.content}</Text>
          </Container>
        )}
        keyExtractor={({item}) => item.id}
      />
    </Container>
  );
}

export default observer(MessageList);
