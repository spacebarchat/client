import Color from 'color';
import {observer} from 'mobx-react';
import React from 'react';
import {Dimensions, StyleSheet, TextInput} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import Channel from '../../stores/objects/Channel';
import {CustomTheme} from '../../types';
import Container from '../Container';

const dimensions = Dimensions.get('window');
const MAX_LENGTH = 2000; // TODO: some kind of server side config for non-premium, length for premium, etc

interface Props {
  channel: Channel;
}

function MessageInput({channel}: Props) {
  const theme = useTheme<CustomTheme>();
  const [text, setText] = React.useState('');
  const [height, setHeight] = React.useState(0);

  return (
    <Container
      style={[
        styles.container,
        {backgroundColor: theme.colors.palette.background70},
      ]}>
      <Container
        row
        horizontalCenter
        style={[
          styles.wrapper,
          {backgroundColor: theme.colors.palette.backgroundSecondary70},
        ]}>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.whiteBlack,
              height,
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
          onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
          onLayout={e => setHeight(e.nativeEvent.layout.height)}
          maxLength={MAX_LENGTH}
        />
        <IconButton
          icon="send"
          size={20}
          onPress={() => {
            channel.sendMessage({
              content: text,
            });
            setText('');
            setHeight(0);
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
    borderRadius: 8,
  },
  input: {
    flex: 1,
    maxHeight: dimensions.width / 2,
    minHeight: 42,
    paddingHorizontal: 12,
    paddingTop: 12, // to make it look like the text is centered, multiline text is a bit higher than single line
  },
});

export default observer(MessageInput);
