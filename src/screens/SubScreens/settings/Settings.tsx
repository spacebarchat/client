import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Button,
  HelperText,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import Container from '../../../components/Container';
import Dropdown, {DropdownItem} from '../../../components/Dropdown';
import Hr from '../../../components/Hr';
import {Theme, themes} from '../../../constants/Colors';
import {DefaultRouteSettings, Globals} from '../../../constants/Globals';
import {DomainContext} from '../../../stores/DomainStore';
import {EXPERIMENT_LIST} from '../../../stores/ExperimentsStore';
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
    <Container flex={1} style={styles.contentContainer}>
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
        <Hr style={{marginVertical: 10}} />
        {domain.experiments.isExperimentEnabled('test') && (
          <>
            <Text>
              Test experiment is enabled;{' '}
              {domain.experiments.getTreatment('test')?.name}
            </Text>
            <Hr style={{marginVertical: 10}} />
          </>
        )}

        <Text variant="headlineSmall">Experiments</Text>
        {EXPERIMENT_LIST.map(x => (
          <Container key={x.id}>
            <Text variant="bodyLarge" style={{fontWeight: 'bold'}}>
              {x.name}
            </Text>
            <Text variant="labelMedium">{x.id}</Text>
            <Dropdown
              data={x.treatments.map(t => ({
                label: t.name,
                value: t.id.toString(),
              }))}
              label={domain.experiments.getTreatment(x.id)?.name ?? 'None'}
              onSelect={value => {
                domain.experiments.setTreatment(x.id, Number(value.value));
              }}
            />
            <HelperText type="info" visible>
              {x.treatments
                .map(
                  t => `${t.name}${t.description ? ': ' + x.description : ''}`,
                )
                .join('\n')}
            </HelperText>
            <Hr />
          </Container>
        ))}
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  modal: {},
  contentContainer: {
    margin: 10,
  },
});

export default observer(Settings);
