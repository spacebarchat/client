import {ChannelType} from '@puyodead1/fosscord-api-types/v9';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Avatar, HelperText, Text, useTheme} from 'react-native-paper';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme} from '../types';
import {CDNRoutes, DefaultUserAvatarAssets} from '../utils/Endpoints';
import {t} from '../utils/i18n';
import REST from '../utils/REST';
import Container from './Container';

interface Props {
  guildId: string;
}

function ChannelsSidebar({guildId}: Props) {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);

  React.useEffect(() => {
    if (guildId === 'me') {
      // render PMs
    }
  }, [guildId]);

  const data = Array.from(domain.privateChannels.channels.values()).map(x => ({
    id: x.id,
    item: x,
  }));

  return (
    <Container
      style={[
        styles.container,
        {backgroundColor: theme.colors.palette.background60},
      ]}>
      <FlatList
        data={data}
        keyExtractor={x => x.id}
        renderItem={({item: {item}}) => {
          const user = item.recipients![0];
          const avatarUrl =
            item.type === ChannelType.GroupDM
              ? undefined
              : user.avatar
              ? REST.makeCDNUrl(CDNRoutes.userAvatar(user.id, user.avatar))
              : REST.makeCDNUrl(
                  CDNRoutes.defaultUserAvatar(
                    (Number(user.discriminator) % 5) as DefaultUserAvatarAssets,
                  ),
                );
          return (
            <Container row horizontalCenter style={{marginTop: 10}}>
              {avatarUrl ? (
                <Avatar.Image
                  source={{uri: avatarUrl}}
                  size={32}
                  style={{marginRight: 10}}
                />
              ) : (
                <Avatar.Icon
                  icon="account-multiple"
                  size={32}
                  color={theme.colors.whiteBlack}
                  style={{
                    marginRight: 10,
                    backgroundColor: theme.colors.palette.red50,
                  }}
                />
              )}
              <Container>
                <Text variant="bodySmall">
                  {item.type === ChannelType.GroupDM
                    ? item.recipients!.map(x => x.username).join(', ')
                    : user.username}
                </Text>
                {item.type === ChannelType.GroupDM && (
                  <HelperText type="info" padding="none" variant="bodySmall">
                    {t('channel:GROUP_DM_MEMBER_COUNT', {
                      count: item.recipients!.length,
                    })}
                  </HelperText>
                )}
              </Container>
            </Container>
          );
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => (
          <Text style={{color: theme.colors.text}}>
            {t('channel:DM_LIST_HEADER')}
          </Text>
        )}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '100%',
    width: 240, // this leaves a bit of a gap between the sidebar and the main content swiper
    // width: '100%', // this makes the sidebar fill the rest of the space, not sure if we should do this or not
  },
});

export default ChannelsSidebar;
