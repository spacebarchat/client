import Color from 'color';
import {observer} from 'mobx-react';
import React from 'react';
import {Dimensions, StyleSheet, TextInput} from 'react-native';
import {useTheme} from 'react-native-paper';
import Channel from '../stores/objects/Channel';
import {CustomTheme} from '../types';
import Container from './Container';

const dimensions = Dimensions.get('window');
const MAX_LENGTH = 2000; // TODO: some kind of server side config for non-premium, length for premium, etc

interface Props {
  channel: Channel;
}

function MessageInput({channel}: Props) {
  const theme = useTheme<CustomTheme>();
  const [text, setText] = React.useState('');

  // taken from https://github.com/necolas/react-native-web/issues/795#issuecomment-1297511068
  const adjustTextInputSize = (evt: any) => {
    const el = evt?.target || evt?.nativeEvent?.target;
    if (el) {
      el.style.height = 0;
      const newHeight = el.offsetHeight - el.clientHeight + el.scrollHeight;
      el.style.height = `${newHeight}px`;
    }
  };

  return (
    <Container
      style={[
        styles.container,
        {backgroundColor: theme.colors.palette.background70},
      ]}>
      <Container style={styles.wrapper}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.palette.backgroundSecondary70,
              color: theme.colors.whiteBlack,
            },
          ]}
          multiline
          placeholder={`Message #${channel.name}`}
          placeholderTextColor={Color(
            theme.colors.palette.backgroundSecondary100,
          )
            .lighten(0.5)
            .hex()}
          value={text}
          onChangeText={setText}
          onChange={adjustTextInputSize}
          onLayout={adjustTextInputSize}
          maxLength={MAX_LENGTH}
          onKeyPress={e => {
            // @ts-ignore
            if (e.which === 13 && !e.shiftKey) {
              // send message
              e.preventDefault();

              channel.sendMessage({
                content: text,
              });
              setText('');
            }
          }}
        />
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  wrapper: {
    marginBottom: 24,
  },
  input: {
    // @ts-ignore
    outlineStyle: 'none',
    borderRadius: 8,
    maxHeight: dimensions.width / 2,
    minHeight: 42,
    paddingHorizontal: 12,
    paddingTop: 12, // to make it look like the text is centered, multiline text is a bit higher than single line
  },
});

export default observer(MessageInput);
