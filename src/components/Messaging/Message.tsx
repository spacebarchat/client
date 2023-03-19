import {observer} from 'mobx-react';
import 'moment-timezone';
import React from 'react';
import Moment from 'react-moment';
import {
  Animated,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import {Avatar, Text, useTheme} from 'react-native-paper';
import {ContextMenuContext} from '../../contexts/ContextMenuContext';
import {DomainContext} from '../../stores/DomainStore';
import {QueuedMessage} from '../../stores/MessageQueue';
import Message from '../../stores/objects/Message';
import {CustomTheme} from '../../types';
import {calendarStrings} from '../../utils/i18n/date';
import Container from '../Container';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const ANIMATION_TIME = 50; // the duration of the hover animation

interface Props {
  message: Message | QueuedMessage;
  isHeader?: boolean;
  failed?: boolean;
  sending?: boolean;
}

function MessageItem({message, isHeader, failed, sending}: Props) {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);
  const contextMenu = React.useContext(ContextMenuContext);
  const [bgColor] = React.useState(new Animated.Value(0));
  const author = domain.users.get(
    typeof message.author === 'string' ? message.author : message.author.id,
  );
  const timestamp = 'timestamp' in message ? message.timestamp : new Date();

  const onHoverIn = () => {
    Animated.timing(bgColor, {
      toValue: 1,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();
  };

  const onHoverOut = () => {
    Animated.timing(bgColor, {
      toValue: 0,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Container
      testID="message"
      flex={1}
      style={isHeader ? styles.containerHeader : undefined}>
      <AnimatedPressable
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
        onContextMenu={(e: NativeSyntheticEvent<any>) => {
          e.preventDefault();
          contextMenu.open({
            position: {
              x: e.nativeEvent.pageX,
              y: e.nativeEvent.pageY,
            },
            items: [
              {
                label: 'Copy ID',
                onPress: () => {
                  // @ts-expect-error - this is web-only
                  navigator.clipboard.writeText(message.id);
                },
              },
            ],
          });
        }}
        style={[
          Platform.isWeb
            ? {
                backgroundColor: bgColor.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    theme.colors.palette.background70,
                    theme.colors.palette.background65,
                  ],
                }),
                // @ts-expect-error - this is web-only
                cursor: 'inherit',
              }
            : undefined,
          {flex: 1},
        ]}>
        <Container row flex={1} style={styles.container}>
          {isHeader && (
            <Avatar.Image
              testID="messageAvatar"
              size={40}
              source={{uri: author?.avatarURL}}
              style={styles.avatar}
            />
          )}
          <Container
            testID="messageContentContainer"
            flex={1}
            style={!isHeader ? {marginLeft: 50} : undefined}>
            {isHeader && (
              <Container testID="messageHeader" row flex={1}>
                <Text testID="messageAuthor" style={styles.messageAuthor}>
                  {author?.username}
                </Text>
                <Container>
                  <Moment
                    element={Text}
                    calendar={calendarStrings}
                    style={{
                      color: theme.colors.palette.gray100,
                      marginLeft: 10,
                    }}>
                    {timestamp}
                  </Moment>
                </Container>
              </Container>
            )}
            <Text
              style={[
                styles.messageContent,
                sending ? {opacity: 0.5} : undefined,
                failed ? {color: theme.colors.palette.error50} : undefined,
              ]}>
              {message.content}
            </Text>
          </Container>
        </Container>
      </AnimatedPressable>
    </Container>
  );
}

const styles = StyleSheet.create({
  containerHeader: {
    marginTop: 17,
  },
  container: {
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  avatar: {
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  messageAuthor: {
    fontFamily: 'SourceSans3-Semibold',
  },
  messageContent: {
    fontFamily: 'SourceSans3-Regular',
  },
});

export default observer(MessageItem);
