import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useModal} from 'react-native-modalfy';
import {useTheme} from 'react-native-paper';
import {ContextMenuContext} from '../contexts/ContextMenuContext';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme} from '../types';
import {CDNRoutes} from '../utils/Endpoints';
import REST from '../utils/REST';
import Container from './Container';
import GuildsSidebarItem, {
  GuildsSidebarItemProps,
  GuildsSidebarItemType,
} from './GuildsSidebarItem';

function GuildsSidebar() {
  const domain = React.useContext(DomainContext);
  const navigation = useNavigation();
  const theme = useTheme<CustomTheme>();
  const contextMenu = React.useContext(ContextMenuContext);
  const {openModal} = useModal();

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
    }>(x => {
      const commonProps: Partial<GuildsSidebarItemProps> = {
        onPress: () =>
          navigation.navigate('App', {
            screen: 'Channel',
            params: {guildId: x.id},
          }),
        tooltip: x.name,
        onContextMenu: e => {
          e.preventDefault();
          contextMenu.open({
            position: {
              x: e.nativeEvent.pageX,
              y: e.nativeEvent.pageY,
            },
            items: [
              {
                label: 'Copy ID',
                onPress: () => {
                  // @ts-expect-error - this is web-only
                  navigator.clipboard.writeText(x.id);
                },
              },
            ],
          });
        },
      };

      return {
        id: x.id,
        item: x.icon
          ? {
              ...commonProps,
              type: GuildsSidebarItemType.IMAGE,
              props: {
                source: {
                  uri: REST.makeCDNUrl(CDNRoutes.guildIcon(x.id, x.icon)),
                },
              },
            }
          : {
              ...commonProps,
              type: GuildsSidebarItemType.TEXT,
              props: {
                label: x.acronym,
                color: theme.colors.whiteBlack,
              },
            },
      };
    }),
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
        onPress: () => openModal('AddServer'),
        tooltip: 'Add Server',
      },
    },
  ];

  // const renderSeperator = () => {
  //   count.current += 1;

  //   return count.current === 1 ? (
  //     <Hr
  //       style={{
  //         borderBottomWidth: 2,
  //         marginBottom: 5,
  //         marginHorizontal: 10,
  //       }}
  //     />
  //   ) : null;
  // };

  return (
    <Container style={styles.container}>
      <FlashList
        estimatedItemSize={48}
        data={data}
        renderItem={({item}) => {
          return <GuildsSidebarItem {...item.item} />;
        }}
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
