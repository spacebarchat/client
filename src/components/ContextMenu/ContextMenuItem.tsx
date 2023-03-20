import React from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  TextProps,
  ViewProps,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {IconProps} from 'react-native-vector-icons/Icon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomTheme} from '../../types';
import Container from '../Container';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const ANIMATION_TIME = 50; // the duration of the hover animation

export interface IContextMenuItem {
  label: string;
  onPress: () => void;
  textProps?: TextProps;
  iconProps?: IconProps;
  containerProps?: ViewProps;
  color?: string;
}

interface Props {
  item: IContextMenuItem;
  index: number;
  close: () => void;
}

function ContextMenuItem({item, index, close}: Props) {
  const theme = useTheme<CustomTheme>();
  const [bgColor] = React.useState(new Animated.Value(0));
  const [color] = React.useState(new Animated.Value(0));

  const onHoverIn = () => {
    Animated.timing(bgColor, {
      toValue: 1,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();

    Animated.timing(color, {
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

    Animated.timing(color, {
      toValue: 0,
      duration: ANIMATION_TIME,
      useNativeDriver: false,
    }).start();
  };

  return (
    <AnimatedPressable
      key={index}
      onPress={() => {
        item.onPress();
        close();
      }}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      style={[
        styles.pressable,
        Platform.isWeb
          ? {
              backgroundColor: bgColor.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  theme.colors.palette.background40,
                  item.color ?? theme.colors.primary,
                ],
              }),
            }
          : undefined,
      ]}>
      <Container
        row
        {...item.containerProps}
        style={[item.containerProps?.style, styles.itemContainer]}>
        <AnimatedText
          {...item.textProps}
          style={[
            item.textProps?.style,
            Platform.isWeb && item.color
              ? {
                  color: bgColor.interpolate({
                    inputRange: [0, 1],
                    outputRange: [item.color, theme.colors.whiteBlack],
                  }),
                }
              : undefined,
          ]}>
          {item.label}
        </AnimatedText>
        {item.iconProps && (
          <AnimatedIcon
            size={item.iconProps.size ?? 20}
            {...item.iconProps}
            style={[
              item.iconProps.style,
              Platform.isWeb && item.color
                ? {
                    color: bgColor.interpolate({
                      inputRange: [0, 1],
                      outputRange: [item.color, theme.colors.whiteBlack],
                    }),
                  }
                : undefined,
            ]}
            color={item.color ?? theme.colors.whiteBlack}
          />
        )}
      </Container>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pressable: {borderRadius: 5},
  itemContainer: {
    justifyContent: 'space-between',
    padding: 5,
  },
});

export default ContextMenuItem;
