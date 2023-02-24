import {observer} from 'mobx-react-lite';
import React from 'react';
import {Platform, SectionList} from 'react-native';
import {Avatar, Text, useTheme} from 'react-native-paper';
import {CustomTheme} from '../../constants/Colors';
import {DomainContext} from '../../stores/DomainStore';
import Channel from '../../stores/objects/Channel';
import Guild from '../../stores/objects/Guild';
import {CDNRoutes, DefaultUserAvatarAssets} from '../../utils/Endpoints';
import REST from '../../utils/REST';
import Container from '../Container';

interface Props {
  guild: Guild;
  channel: Channel;
}

// TODO: user avatar and status
// TODO: user activity
function MemberList({guild, channel}: Props) {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);

  React.useEffect(() => {
    domain.gateway.onChannelOpen(guild.id, channel.id);
  }, [guild]);

  return React.useMemo(
    () => (
      <SectionList
        sections={guild.memberList?.listData || []}
        keyExtractor={(item, index) => index + item.user?.id!}
        renderItem={({item}) => {
          const highestRoleId = item.roles[0];
          const role = highestRoleId
            ? guild.roles.get(highestRoleId)
            : undefined;
          const colorStyle = role ? {color: role.color} : {};

          // TODO: get member presence and set opacity (~0.2) for offline members
          return (
            // TODO: move this to a separate component
            <Container
              row
              horizontalCenter
              style={{
                paddingVertical: 5,
              }}>
              <Container>
                <Avatar.Image
                  testID="messageAvatar"
                  size={32}
                  source={{
                    uri: item.avatar
                      ? REST.makeCDNUrl(
                          CDNRoutes.userAvatar(
                            item.user?.id!,
                            item.user?.avatar!,
                          ),
                        )
                      : REST.makeCDNUrl(
                          CDNRoutes.defaultUserAvatar(
                            (Number(item.user?.discriminator) %
                              6) as DefaultUserAvatarAssets,
                          ),
                        ),
                  }}
                  style={{backgroundColor: 'transparent'}}
                />
              </Container>
              <Container style={{marginLeft: 10}}>
                <Text style={colorStyle}>{item.user?.username}</Text>
              </Container>
            </Container>
          );
        }}
        renderSectionHeader={({section: {title}}) => (
          <Container
            style={{
              backgroundColor: theme.colors.palette.neutral30,
              paddingTop: 10,
            }}>
            <Text
              style={{
                color: theme.colors.textMuted,
              }}>
              {title}
            </Text>
          </Container>
        )}
        stickySectionHeadersEnabled={Platform.isMobile}
        contentContainerStyle={{padding: 10}}
      />
    ),
    [guild.memberList],
  );
}

export default observer(MemberList);
