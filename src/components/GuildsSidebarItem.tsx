import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {
  Animated,
  ImageProps,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import {
  Avatar,
  AvatarIconProps,
  AvatarImageProps,
  AvatarTextProps,
  useTheme,
} from 'react-native-paper';
import {Popable, usePopable} from 'react-native-popable';
import {CustomTheme} from '../types';

interface CustomAvatarImageProps extends Omit<AvatarImageProps, 'source'> {
  source: ImageProps['source'];
}

export enum GuildsSidebarItemType {
  ICON = 'icon',
  IMAGE = 'image',
  TEXT = 'text',
}

interface CommonProps {
  onPress?: () => void;
  onContextMenu?: (e: NativeSyntheticEvent<any>) => void;
  backgroundColorTo?: string;
  colorTo?: string;
  tooltip?: string;
}

interface PropsIcon extends CommonProps {
  type: GuildsSidebarItemType.ICON;
  props: AvatarIconProps;
}

interface PropsImage extends CommonProps {
  type: GuildsSidebarItemType.IMAGE;
  props: CustomAvatarImageProps;
}

interface PropsText extends CommonProps {
  type: GuildsSidebarItemType.TEXT;
  props: AvatarTextProps;
}

class AvatarImage extends React.Component<AvatarImageProps> {
  constructor(props: AvatarImageProps) {
    super(props);
  }
  render() {
    return <Avatar.Image {...this.props} />;
  }
}

class AvatarText extends React.Component<AvatarTextProps> {
  constructor(props: AvatarTextProps) {
    super(props);
  }
  render() {
    return <Avatar.Text {...this.props} />;
  }
}

class AvatarIcon extends React.Component<AvatarIconProps> {
  constructor(props: AvatarIconProps) {
    super(props);
  }
  render() {
    return <Avatar.Icon {...this.props} />;
  }
}

const AnimatedAvatarImage = Animated.createAnimatedComponent(AvatarImage);
const AnimatedAvatarText = Animated.createAnimatedComponent(AvatarText);
const AnimatedAvatarIcon = Animated.createAnimatedComponent(AvatarIcon);

export type GuildsSidebarItemProps = PropsIcon | PropsImage | PropsText;

function GuildsSidebarItem(props: GuildsSidebarItemProps) {
  const theme = useTheme<CustomTheme>();
  const navigation = useNavigation();
  const [popableRef, {hide, show}] = usePopable();
  const [backgroundColor] = React.useState(new Animated.Value(0));
  const [color] = React.useState(new Animated.Value(0));
  const [borderRadius] = React.useState(new Animated.Value(0));

  const onHoverIn = () => {
    Animated.timing(backgroundColor, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();

    Animated.timing(borderRadius, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();

    Animated.timing(color, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();

    if (props.tooltip && Platform.isWeb) {
      show();
    }
  };

  const onHoverOut = () => {
    Animated.timing(backgroundColor, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();

    Animated.timing(borderRadius, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();

    Animated.timing(color, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();

    if (props.tooltip && Platform.isWeb) {
      hide();
    }
  };

  const item = (
    <Pressable
      style={[styles.container]}
      onPress={props.onPress}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      // @ts-expect-error - this is web-only
      onContextMenu={props.onContextMenu}>
      {props.type === 'image' && (
        <AnimatedAvatarImage
          size={48}
          {...props.props}
          // eslint-disable-next-line react/no-unstable-nested-components
          source={() => (
            <Animated.Image
              source={props.props.source}
              style={{
                width: 48,
                height: 48,
                borderRadius: borderRadius.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 15],
                }),
              }}
            />
          )}
        />
      )}
      {props.type === 'text' && (
        <AnimatedAvatarText
          size={48}
          {...props.props}
          {...(props.colorTo && {
            color: color.interpolate({
              inputRange: [0, 1],
              outputRange: [
                props.props.color ?? theme.colors.whiteBlack,
                props.colorTo,
              ],
            }),
          })}
          style={[
            props.props.style,
            {
              borderRadius: borderRadius.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 15],
              }),
              backgroundColor: backgroundColor.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  theme.colors.palette.backgroundSecondary60,
                  props.backgroundColorTo ?? theme.colors.primary,
                ],
              }),
            },
          ]}
        />
      )}
      {props.type === 'icon' && (
        <AnimatedAvatarIcon
          size={48}
          {...props.props}
          {...(props.colorTo && {
            color: color.interpolate({
              inputRange: [0, 1],
              outputRange: [
                props.props.color ?? theme.colors.whiteBlack,
                props.colorTo,
              ],
            }),
          })}
          style={[
            props.props.style,
            {
              borderRadius: borderRadius.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 15],
              }),
              backgroundColor: backgroundColor.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  theme.colors.palette.backgroundSecondary60,
                  props.backgroundColorTo ?? theme.colors.primary,
                ],
              }),
            },
          ]}
        />
      )}
    </Pressable>
  );

  return props.tooltip && Platform.isWeb ? (
    <Popable
      content={props.tooltip}
      position="right"
      action="hover"
      style={{zIndex: 100}}
      ref={popableRef}>
      {item}
    </Popable>
  ) : (
    item
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default observer(GuildsSidebarItem);
