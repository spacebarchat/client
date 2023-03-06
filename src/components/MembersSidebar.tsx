import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {CustomTheme} from '../types';
import Container from './Container';

function MembersSidebar() {
  const theme = useTheme<CustomTheme>();

  return (
    <Container
      style={[
        styles.container,
        {backgroundColor: theme.colors.palette.background60},
      ]}>
      <Text>Members Sidebar</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
  },
});

export default MembersSidebar;
