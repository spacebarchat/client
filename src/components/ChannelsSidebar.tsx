import {APIChannel} from '@puyodead1/fosscord-api-types/v9';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import useGuild from '../hooks/useGuild';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme} from '../types';
import {t} from '../utils/i18n';
import ChannelSidebarItem from './ChannelSidebarItem';
import Container from './Container';

interface Props {
  guildId: string;
}

function ChannelsSidebar({guildId}: Props) {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);
  const guild = useGuild(guildId);
  const [data, setData] = React.useState<
    {
      id: string;
      item: APIChannel;
    }[]
  >([]);

  React.useEffect(() => {
    if (guildId === 'me') {
      setData(
        Array.from(domain.privateChannels.channels.values()).map(x => ({
          id: x.id,
          item: x,
        })),
      );
    } else {
      if (!guild) {
        return setData([]);
      }

      setData(
        Array.from(guild.channels.values()).map(x => ({
          id: x.id,
          item: x,
        })),
      );
    }
  }, [domain.privateChannels, guildId, guild]);

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
          return <ChannelSidebarItem channel={item} />;
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => (
          <Text style={{color: theme.colors.text}}>
            {guildId === 'me' ? t('channel:DM_LIST_HEADER') : 'Channels'}
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
