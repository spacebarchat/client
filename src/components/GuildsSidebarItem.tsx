import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Avatar, useTheme} from 'react-native-paper';
import Guild from '../stores/objects/Guild';
import {CustomTheme} from '../types';
import {CDNRoutes} from '../utils/Endpoints';
import REST from '../utils/REST';

interface Props {
  guild: Guild;
}

function GuildsSidebarItem({guild}: Props) {
  const theme = useTheme<CustomTheme>();
  //   const [myAnimation] = React.useState(new Animated.Value(0));

  const onPress = () => {};

  const onHoverIn = () => {
    // Animated.timing(myAnimation, {
    //   toValue: 1,
    //   duration: 160,
    //   useNativeDriver: false,
    // }).start();
  };

  const onHoverOut = () => {
    // Animated.timing(myAnimation, {
    //   toValue: 0,
    //   duration: 160,
    //   useNativeDriver: false,
    // }).start();
  };

  return (
    <Pressable
      style={[styles.container]}
      onPress={onPress}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}>
      {guild.icon ? (
        <Avatar.Image
          size={48}
          source={{
            uri: REST.makeCDNUrl(CDNRoutes.guildIcon(guild.id, guild.icon)),
          }}
          style={{backgroundColor: 'transparent'}}
        />
      ) : (
        <Avatar.Text
          size={48}
          label={guild.acronym}
          labelStyle={{
            color: theme.colors.whiteBlack,
          }}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
});

export default GuildsSidebarItem;
