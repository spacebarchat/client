import {ChannelType} from '@puyodead1/fosscord-api-types/v9';
import {observer} from 'mobx-react';
import React from 'react';
import {SectionList, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import useGuild from '../hooks/useGuild';
import {DomainContext} from '../stores/DomainStore';
import Channel from '../stores/objects/Channel';
import {CustomTheme} from '../types';
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
      title?: string;
      data: Channel[];
    }[]
  >([]);

  React.useEffect(() => {
    if (guildId === 'me') {
      // render private channels
      // TODO: how do we want to sort these?
      setData([
        {
          data: domain.privateChannels.getAll(),
        },
      ]);
    } else {
      if (!guild) {
        return setData([]);
      }

      const channels = guild.channels
        .getAll()
        .sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));
      const channelsWithoutCategory = channels.filter(
        x => !x.parentId && x.type !== ChannelType.GuildCategory,
      ); // TODO: we should be checking if its a guild channel, not just not a category

      const mapped = channels
        .filter(x => x.type === ChannelType.GuildCategory)
        .map(category => {
          const channelsInCategory = channels.filter(
            channel => channel.parentId === category.id,
          );
          return {
            title: category.name!,
            data: channelsInCategory,
          };
        });

      setData([...mapped, {data: channelsWithoutCategory}]);
    }
  }, [domain.privateChannels, guildId, guild]);

  return (
    <Container
      style={[
        styles.container,
        {backgroundColor: theme.colors.palette.background60},
      ]}>
      <ChannelListHeader
        children={<Text>{guild?.name ?? 'Direct Messages'}</Text>}
      />
      <Container>
        {/* <FlatList
          data={data}
          contentContainerStyle={styles.listWrapper}
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
        /> */}
        <SectionList
          sections={data}
          keyExtractor={(item, index) => `${index}_${item.id}`}
          renderItem={({item}) => <ChannelSidebarItem channel={item} />}
          renderSectionHeader={({section: {title}}) => {
            if (!title) {
              return null;
            }
            return (
              <Container>
                <Text style={{color: theme.colors.palette.gray100}}>
                  {title.toUpperCase()}
                </Text>
              </Container>
            );
          }}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{padding: 10}}
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
