import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme} from '../types';
import {CDNRoutes} from '../utils/Endpoints';
import REST from '../utils/REST';
import Container from './Container';
import GuildsSidebarItem, {
  GuildsSidebarItemProps,
  GuildsSidebarItemType,
} from './GuildsSidebarItem';
import Hr from './Hr';

function GuildsSidebar() {
  const domain = React.useContext(DomainContext);
  const navigation = useNavigation();
  const theme = useTheme<CustomTheme>();
  const count = React.useRef(0);

  const data: {
    id: string;
    item: GuildsSidebarItemProps;
  }[] = [
    {
      id: 'home',
      item: {
        type: GuildsSidebarItemType.ICON,
        props: {
          icon: 'home',
          color: theme.colors.whiteBlack,
          style: {
            marginBottom: 10,
          },
        },
        onPress: () =>
          navigation.navigate('App', {
            screen: 'Channel',
            params: {guildId: 'me'},
          }),
        tooltip: 'Home',
      },
    },
    ...Array.from(domain.guilds.guilds.values()).map<{
      id: string;
      item: GuildsSidebarItemProps;
    }>(x => ({
      id: x.id,
      item: x.icon
        ? {
            type: GuildsSidebarItemType.IMAGE,
            props: {
              source: {
                uri: REST.makeCDNUrl(CDNRoutes.guildIcon(x.id, x.icon)),
              },
            },
            onPress: () =>
              navigation.navigate('App', {
                screen: 'Channel',
                params: {guildId: x.id},
              }),
            tooltip: x.name,
          }
        : {
            type: GuildsSidebarItemType.TEXT,
            props: {
              label: x.acronym,
              color: theme.colors.whiteBlack,
            },
            onPress: () =>
              navigation.navigate('App', {
                screen: 'Channel',
                params: {guildId: x.id},
              }),
            tooltip: x.name,
          },
    })),
    {
      id: 'add-server',
      item: {
        type: GuildsSidebarItemType.ICON,
        props: {
          icon: 'plus',
          color: theme.colors.palette.green50,
          style: {
            marginBottom: 10,
          },
        },
        backgroundColorTo: theme.colors.palette.green50,
        colorTo: theme.colors.whiteBlack,
        // onPress: () =>
        //   navigation.navigate('App', {
        //     screen: 'Channel',
        //     params: {guildId: 'me'},
        //   }),
        tooltip: 'Add Server',
      },
    },
  ];

  const renderSeperator = () => {
    count.current += 1;

    return count.current === 1 ? (
      <Hr style={{borderBottomWidth: 2, marginBottom: 5}} />
    ) : null;
  };

  return (
    <Container style={styles.container}>
      <FlatList
        contentContainerStyle={{
          alignItems: 'center',
          flex: 1,
        }}
        style={{overflow: 'visible'}}
        data={data}
        renderItem={({item}) => {
          return <GuildsSidebarItem {...item.item} />;
        }}
        ItemSeparatorComponent={renderSeperator}
        keyExtractor={item => item.id}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: 72,
    zIndex: 3,
  },
});

export default observer(GuildsSidebar);
