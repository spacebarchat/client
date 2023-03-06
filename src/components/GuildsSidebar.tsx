import {observer} from 'mobx-react';
import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {
  Avatar,
  AvatarIconProps,
  AvatarImageProps,
  AvatarTextProps,
} from 'react-native-paper';
import {DomainContext} from '../stores/DomainStore';
import Guild from '../stores/objects/Guild';
import Container from './Container';
import GuildsSidebarItem from './GuildsSidebarItem';

interface ItemIcon extends AvatarIconProps {
  type: 'icon';
}

interface ItemText extends AvatarTextProps {
  type: 'text';
}

interface ItemImage extends AvatarImageProps {
  type: 'image';
}

function GuildsSidebar() {
  const domain = React.useContext(DomainContext);

  // TODO: memo?
  const data: {
    id: string;
    item: Guild | ItemIcon | ItemText | ItemImage;
  }[] = [
    {
      id: 'home',
      item: {
        type: 'icon',
        icon: 'home',
        size: 48,
        style: {
          marginTop: 5,
          marginBottom: 10,
        },
      },
    },
    ...Array.from(domain.guilds.guilds.values()).map(x => ({
      id: x.id,
      item: x,
    })),
  ];

  return (
    <Container style={styles.container}>
      <FlatList
        contentContainerStyle={{alignItems: 'center'}}
        data={data}
        renderItem={({item}) => {
          if ('type' in item.item) {
            switch (item.item.type) {
              case 'icon':
                return <Avatar.Icon {...item.item} />;
              case 'text':
                return <Avatar.Text {...item.item} />;
              case 'image':
                return <Avatar.Image {...item.item} />;
            }
          } else {
            return <GuildsSidebarItem guild={item.item} />;
          }
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
