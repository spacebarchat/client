import {observer} from 'mobx-react';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import useGuild from '../hooks/useGuild';
import {DomainContext} from '../stores/DomainStore';
import Channel from '../stores/objects/Channel';
import {CustomTheme} from '../types';
import {t} from '../utils/i18n';
import ChannelListHeader from './ChannelListHeader';
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
      item: Channel;
    }[]
  >([]);

  React.useEffect(() => {
    if (guildId === 'me') {
      // render private channels
      setData(
        domain.privateChannels.getAll().map(x => ({
          id: x.id,
          item: x,
        })),
      );
    } else {
      if (!guild) {
        return setData([]);
      }

      // render guild channels
      setData(
        guild.channels.getAll().map(x => ({
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
      <ChannelListHeader children={<Text>AAAAAAAAA</Text>} />
      <Container style={styles.listWrapper}>
        <FlatList
          data={data}
          keyExtractor={({item}, index) => `${index}_${item.id}`}
          renderItem={({item: {item}}) => {
            return <ChannelSidebarItem channel={item} />;
          }}
          // eslint-disable-next-line react/no-unstable-nested-components
          ListHeaderComponent={() =>
            guildId === 'me' ? (
              <Text style={{color: theme.colors.text}}>
                {t('channel:DM_LIST_HEADER')}
              </Text>
            ) : null
          }
        />
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: 240, // this leaves a bit of a gap between the sidebar and the main content swiper
    // width: '100%', // this makes the sidebar fill the rest of the space, not sure if we should do this or not
  },
  listWrapper: {
    padding: 10,
  },
});

export default observer(ChannelsSidebar);
