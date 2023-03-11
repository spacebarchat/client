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
            .map((x, i, arr) => {
              const isHeader = i === 0 || x.author.id !== arr[i - 1].author.id;
              console.debug(`message ${x.id} isHeader: ${isHeader}`);
              return {
                id: x.id,
                item: x,
                isHeader,
              };
            })
            .reverse() ?? []
        }
        renderItem={({item}) => (
          <MessageItem message={item.item} isHeader={item.isHeader} />
        )}
        keyExtractor={({item}) => item.id}
        inverted
      />
    </Container>
  );
}

export default observer(MessageList);
