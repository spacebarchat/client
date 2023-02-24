import {observer} from 'mobx-react';
import React from 'react';
import {Platform, SectionList} from 'react-native';
import {Surface, Text, useTheme} from 'react-native-paper';
import {CustomTheme} from '../../constants/Colors';
import {DomainContext} from '../../stores/DomainStore';
import Channel from '../../stores/objects/Channel';
import Guild from '../../stores/objects/Guild';
import Container from '../Container';
import MemberListItem from './MemberListItem';

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
  }, [guild, channel]);

  const list = React.useMemo(
    () => (
      <SectionList
        sections={guild.memberList?.listData || []}
        keyExtractor={(item, index) => index + item.user?.id!}
        renderItem={({item}) => <MemberListItem member={item} guild={guild} />}
        renderSectionHeader={({section: {title}}) => (
          <Container
            style={{
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

  return (
    <Container
      testID="memberListContainer"
      flexOne
      style={{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: theme.colors.palette.neutral35,
      }}>
      <Container
        testID="memberListHeader"
        verticalCenter
        horizontalCenter
        style={{
          height: 74,
          padding: 10,
          zIndex: 100,
          backgroundColor: theme.colors.palette.neutral35,
        }}
        element={Surface}
        elevation={2}>
        <Text>Member List Header</Text>
      </Container>
      <Container
        testID="memberListListContainer"
        verticalCenter
        flexOne
        style={{
          padding: 10,
          backgroundColor: theme.colors.palette.neutral35,
        }}>
        {list}
      </Container>
    </Container>
  );
}

export default observer(MemberList);
