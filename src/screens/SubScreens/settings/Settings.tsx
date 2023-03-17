import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import Container from '../../../components/Container';
import Dropdown, {DropdownItem} from '../../../components/Dropdown';
import {Theme, themes} from '../../../constants/Colors';
import {DefaultRouteSettings, Globals} from '../../../constants/Globals';
import {DomainContext} from '../../../stores/DomainStore';
import {CustomTheme} from '../../../types';

function Settings() {
  const navigation = useNavigation();
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);

  const [isLoading, setLoading] = React.useState(false);
  const [routeSettings, setRouteSettings] = React.useState(
    Globals.routeSettings,
  );

  const onSettingChange = (key: keyof typeof Globals.routeSettings) => {
    return async (value: any) => {
      setRouteSettings({...routeSettings, [key]: value});
      Globals.routeSettings[key] = value;
      await Globals.save();
    };
  };

  const reset = async () => {
    setLoading(true);
    setRouteSettings(DefaultRouteSettings);
    Globals.routeSettings = DefaultRouteSettings;
    await Globals.save();
    setLoading(false);
  };

  const close = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      if (domain.token) {
        navigation.navigate('App');
      } else {
        navigation.navigate('Login');
      }
    }
  };

  const themeChange = (item: DropdownItem) => {
    domain.setTheme(item.value as Theme, true);
  };

  return (
    <Container flex={1}>
      <Container>
        <IconButton mode="contained" icon="close" onPress={close} />
      </Container>

      <Container>
        <Container style={{margin: 10}}>
          <Container>
            <Text>Theme</Text>
            <Dropdown
              data={Object.keys(themes).map(x => ({
                label: themes[x as keyof typeof themes].name,
                value: x,
              }))}
              label={domain.theme.name}
              onSelect={themeChange}
            />
          </Container>
          <TextInput
            label="API URL"
            editable={!isLoading}
            value={routeSettings.api}
            placeholder={DefaultRouteSettings.api}
            onChangeText={onSettingChange('api')}
            style={{marginVertical: 10}}
          />
          <TextInput
            editable={!isLoading}
            label="CDN URL"
            value={routeSettings.cdn}
            placeholder={DefaultRouteSettings.cdn}
            onChangeText={onSettingChange('cdn')}
            style={{marginVertical: 10}}
          />
          <TextInput
            editable={!isLoading}
            label="Gateway URL"
            value={routeSettings.gateway}
            placeholder={DefaultRouteSettings.gateway}
            onChangeText={onSettingChange('gateway')}
            style={{marginVertical: 10}}
          />
        </Container>
        <Button disabled={isLoading} onPress={reset} loading={isLoading}>
          Reset route settings to default
        </Button>
        {domain.token && (
          <Button
            disabled={isLoading}
            mode="contained"
            buttonColor={theme.colors.error}
            onPress={() => {
              domain.logout();
            }}>
            Logout
          </Button>
        )}
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  modal: {},
  contentContainer: {
    flex: 1,
    margin: 40,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    // justifyContent: 'center',
    // alignContent: 'center',
  },
});

export default observer(Settings);
