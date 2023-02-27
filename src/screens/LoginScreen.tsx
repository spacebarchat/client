import React from 'react';
import {Button, Text} from 'react-native-paper';
import Container from '../components/Container';
import {DomainContext} from '../stores/DomainStore';

function LoginScreen() {
  const domain = React.useContext(DomainContext);

  const storeToken = () => {
    console.log('storeToken');
    domain.setToken('https://youtu.be/dQw4w9WgXcQ');
  };

  return (
    <Container>
      <Text>Login Screen</Text>

      <Button mode="contained" onPress={storeToken}>
        Store Token
      </Button>
    </Container>
  );
}

export default LoginScreen;
