import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import ChannelsSidebar from '../../components/ChannelsSidebar';
import Container from '../../components/Container';
import GuildsSidebar from '../../components/GuildsSidebar';
import Swiper from '../../components/Swiper';
import {DomainContext} from '../../stores/DomainStore';
import {ChannelsStackScreenProps, CustomTheme} from '../../types';

function ChannelScreen({
  route: {
    params: {guildId, channelId},
  },
}: ChannelsStackScreenProps<'Channel'>) {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);

  const leftAction = (
    <Container row>
      <GuildsSidebar />
      <ChannelsSidebar guildId={guildId} />
    </Container>
  );

  const rightAction = (
    <Container>
      <Text>Right Action</Text>
    </Container>
  );

  return (
    <Swiper leftChildren={leftAction} rightChildren={rightAction}>
      <Container
        flex={1}
        style={[
          styles.container,
          {backgroundColor: theme.colors.palette.background70},
        ]}>
        <Text>Channel Screen (Native)</Text>
        <Text>Guild ID: {guildId}</Text>
        <Text>Channel ID: {channelId ?? 'N/A'}</Text>
        <Text>Guild Count: {domain.guilds.count}</Text>
        <Text>User Count: {domain.users.count}</Text>
        <Text>Private Channel Count: {domain.privateChannels.count}</Text>
      </Container>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default observer(ChannelScreen);
