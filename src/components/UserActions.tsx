import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {Avatar, IconButton, Text} from 'react-native-paper';
import {DomainContext} from '../stores/DomainStore';
import Container from './Container';

function UserActions() {
  const domain = React.useContext(DomainContext);
  const navigation = useNavigation();

  const openSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <Container
      testID="userActions"
      displayFlex
      row
      horizontalCenter
      style={{
        height: 52,
        paddingVertical: 8,
        backgroundColor: 'transparent',
      }}>
      <Container testID="user" row horizontalCenter>
        <Container style={{marginHorizontal: 8}}>
          <Avatar.Image
            size={32}
            source={{uri: domain.account.user?.avatarURL}}
          />
        </Container>
        <Container>
          <Text>
            {domain.account.user?.username}#{domain.account.user?.discriminator}
          </Text>
        </Container>
      </Container>
      <Container>
        <IconButton
          mode="contained"
          icon="cog"
          onPress={openSettings}
          size={24}
          style={{backgroundColor: 'transparent'}}
        />
      </Container>
    </Container>
  );
}

export default observer(UserActions);
