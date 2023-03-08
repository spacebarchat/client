import {observer} from 'mobx-react';
import React from 'react';
import {FlatList} from 'react-native';
import {Text} from 'react-native-paper';
import Channel from '../stores/objects/Channel';
import Container from './Container';

interface Props {
  channel: Channel;
}

function MessageList({channel}: Props) {
  return (
    <Container>
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
