import 'moment-timezone';
import React from 'react';
import Moment from 'react-moment';
import {StyleSheet} from 'react-native';
import {Avatar, Text, useTheme} from 'react-native-paper';
import Message from '../stores/objects/Message';
import {CustomTheme} from '../types';
import {calendarStrings} from '../utils/i18n/date';
import Container from './Container';

interface Props {
  message: Message;
}

function MessageItem({message}: Props) {
  const theme = useTheme<CustomTheme>();

  return (
    <Container testID="message" row flex={1} style={styles.container}>
      <Avatar.Image
        testID="messageAvatar"
        size={40}
        source={{uri: message.author.avatarURL}}
        style={styles.avatar}
      />
      <Container testID="messageContentContainer" flex={1}>
        <Container testID="messageHeader" row flex={1}>
          <Text testID="messageAuthor" style={styles.messageAuthor}>
            {message.author.username}
          </Text>
          <Container>
            <Moment
              element={Text}
              calendar={calendarStrings}
              style={{color: theme.colors.palette.gray100, marginLeft: 10}}>
              {message.timestamp}
            </Moment>
          </Container>
        </Container>
        <Text style={styles.messageContent}>{message.content}</Text>
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
  avatar: {
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  messageAuthor: {
    fontFamily: 'SourceSans3-Semibold',
  },
  messageContent: {
    fontFamily: 'SourceSans3-Light',
  },
});

export default MessageItem;
