import {observer} from 'mobx-react';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {DomainContext} from '../stores/DomainStore';
import Channel from '../stores/objects/Channel';
import {CustomTheme} from '../types';
import Container from './Container';
import MessageItem from './MessageItem';

interface Props {
  channel: Channel;
}

function MessageList({channel}: Props) {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);

  const fetchMore = async () => {
    // get first message in the list to use as before
    const before = channel.messages.getAll()[0].id;
    await channel.getChannelMessages(domain, false, 50, before);
  };

  return (
    <Container
      style={{backgroundColor: theme.colors.palette.background70}}
      flex={1}>
      <FlatList
        onEndReached={fetchMore}
        onEndReachedThreshold={0.7}
        data={
          channel.messages
            .getAll()
            .map((x, i, arr) => {
              // group by author, and only if the previous message is not older than a day
              const t = 1 * 24 * 60 * 60 * 1000;
              const isHeader =
                i === 0 ||
                x.author.id !== arr[i - 1].author.id ||
                x.timestamp.getTime() - arr[i - 1].timestamp.getTime() > t;
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
      <Container style={styles.spacer} />
    </Container>
  );
}

const styles = StyleSheet.create({
  spacer: {
    height: 30,
    width: 1,
  },
});

export default observer(MessageList);
