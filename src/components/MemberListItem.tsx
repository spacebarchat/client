import {
  DefaultUserAvatarAssets,
  PresenceUpdateStatus,
} from '@puyodead1/fosscord-api-types/v9';
import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar, Badge, Text, useTheme} from 'react-native-paper';
import {DomainContext} from '../stores/DomainStore';
import GuildMember from '../stores/objects/GuildMember';
import PresenceStore from '../stores/PresenceStore';
import {CustomTheme} from '../types';
import {CDNRoutes} from '../utils/Endpoints';
import REST from '../utils/REST';
import Container from './Container';

interface Props {
  member: GuildMember;
}

function MemberListItem({member}: Props) {
  const domain = React.useContext(DomainContext);
  const theme = useTheme<CustomTheme>();

  const presence = domain.presences.presences.get(member.user?.id!);
  console.log(presence);
  const highestRole = member.roles[0];
  const colorStyle = highestRole ? {color: highestRole.color} : {};

  return (
    <Container
      row
      horizontalCenter
      style={[
        styles.container,
        {opacity: presence === PresenceUpdateStatus.Offline ? 0.3 : 1},
      ]}>
      <Container>
        <Avatar.Image
          testID="messageAvatar"
          size={32}
          source={{
            uri: member.avatar
              ? REST.makeCDNUrl(
                  CDNRoutes.userAvatar(member.user?.id!, member.user?.avatar!),
                )
              : REST.makeCDNUrl(
                  CDNRoutes.defaultUserAvatar(
                    (Number(member.user?.discriminator) %
                      6) as DefaultUserAvatarAssets,
                  ),
                ),
          }}
          style={{backgroundColor: 'transparent'}}
        />
        <Container
          style={[
            styles.dotContainer,
            {backgroundColor: theme.colors.palette.background30},
          ]}
          verticalCenter
          horizontalCenter>
          <Badge
            style={[
              styles.dot,
              {
                backgroundColor: PresenceStore.getStatusColor(
                  presence ?? PresenceUpdateStatus.Offline,
                ),
              },
            ]}
            size={10}
          />
        </Container>
      </Container>
      <Container style={{marginLeft: 10}}>
        <Text style={colorStyle}>{member.user?.username}</Text>
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  dotContainer: {
    width: 13, // +3 from dot size
    height: 13, // +3 from dot size
    borderRadius: 6,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  dot: {
    alignSelf: 'auto',
  },
});

export default observer(MemberListItem);
