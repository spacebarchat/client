import {CommonActions, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {FlatList} from 'react-native';
import {useTheme} from 'react-native-paper';
import {DomainContext} from '../stores/DomainStore';
import Channel from '../stores/objects/Channel';
import Guild from '../stores/objects/Guild';
import {CustomTheme} from '../types';
import ChatInput from './ChatInput/ChatInput';
import ChatMessage from './ChatMessage';
import Container from './Container';

interface Props {
  channel: Channel;
  guild: Guild;
}

const MessageList = ({channel}: Props) => {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.dispatch(CommonActions.setParams({channelId: channel.id}));

    channel.getChannelMessages(domain, 50).catch(console.error);
  }, [channel]);

  return (
    <Container
      testID="chatContent"
      displayFlex
      flexOne
      style={{backgroundColor: theme.colors.palette.neutral60}}>
      <FlatList
        data={channel.messages.asList().reverse() ?? []}
        renderItem={({item}) => <ChatMessage message={item} />}
        keyExtractor={item => item.id}
        inverted={true}
      />
      <ChatInput channel={channel} />
    </Container>
  );
};

export default observer(MessageList);
