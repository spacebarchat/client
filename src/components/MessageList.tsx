import {observer} from 'mobx-react';
import React from 'react';
import {FlatList} from 'react-native';
import {useTheme} from 'react-native-paper';
import Channel from '../stores/objects/Channel';
import {CustomTheme} from '../types';
import Container from './Container';
import MessageItem from './MessageItem';

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
        data={
          channel.messages
            .getAll()
            .map(x => ({id: x.id, item: x}))
            .reverse() ?? []
        }
        renderItem={({item}) => <MessageItem message={item.item} />}
        keyExtractor={({item}) => item.id}
        inverted
      />
    </Container>
  );
}

export default observer(MessageList);
