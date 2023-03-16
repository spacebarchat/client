import {FlashList} from '@shopify/flash-list';
import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Guild from '../stores/objects/Guild';
import {CustomTheme} from '../types';
import Container from './Container';
import MemberListItem from './MemberListItem';

interface Props {
  guild: Guild;
}

function MembersSidebar({guild}: Props) {
  const theme = useTheme<CustomTheme>();

  return (
    <Container
      style={[
        styles.container,
        {backgroundColor: theme.colors.palette.background60},
      ]}>
      <FlashList
        estimatedItemSize={50}
        data={guild.memberList}
        renderItem={({item}) => {
          if (typeof item === 'string') {
            return (
              <Text
                style={[styles.header, {color: theme.colors.palette.gray100}]}>
                {item}
              </Text>
            );
          } else {
            return <MemberListItem member={item} />;
          }
        }}
        getItemType={item => {
          return typeof item === 'string' ? 'sectionHeader' : 'row';
        }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    padding: 10,
  },
  header: {
    marginTop: 10,
  },
});

export default observer(MembersSidebar);
