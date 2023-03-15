import {FlashList} from '@shopify/flash-list';
import {observer} from 'mobx-react';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import useLogger from '../hooks/useLogger';
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
  const logger = useLogger('MessageList.tsx');
  const listRef = React.useRef<FlashList<any>>(null);

  React.useEffect(() => {
    if (!Platform.isWeb) {
      return;
    }

    const scrollNode: any = listRef.current?.getScrollableNode();
    if (!scrollNode) {
      return;
    }

    const listener = scrollNode.addEventListener('wheel', (e: any) => {
      scrollNode.scrollTop -= e.deltaY;
      e.preventDefault();
    });

    return () => scrollNode.removeEventListener('wheel', listener);
  }, [Platform.isWeb]);

  const fetchMore = async () => {
    if (!channel.messages.count) {
      return;
    }
    // get first message in the list to use as before
    const before = channel.messages.messages[0].id;
    logger.debug(
      `Fetching 50 messages before ${before} for channel ${channel.id}`,
    );
    await channel.getChannelMessages(domain, false, 50, before);
  };

  return (
    <Container
      style={{backgroundColor: theme.colors.palette.background70}}
      flex={1}>
      <FlashList
        onEndReached={fetchMore}
        estimatedItemSize={30}
        data={channel.messages.messages
          .map((x, i, arr) => {
            // group by author, and only if the previous message is not older than a day
            const t = 1 * 24 * 60 * 60 * 1000;
            const isHeader =
              i === 0 ||
              x.author.id !== arr[i - 1].author.id ||
              x.timestamp.getTime() - arr[i - 1].timestamp.getTime() > t;
            return {
              item: x,
              isHeader,
            };
          })
          .reverse()}
        renderItem={({item}) => (
          <MessageItem message={item.item} isHeader={item.isHeader} />
        )}
        keyExtractor={({item}) => item.id}
        inverted
        ref={listRef}
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
