import {observer} from 'mobx-react';
import React from 'react';
import {Text, TextInput} from 'react-native-paper';
import Container from '../../../components/Container';
import Dropdown, {DropdownItem} from '../../../components/Dropdown';
import Hr from '../../../components/Hr';
import {Theme, themes} from '../../../constants/Colors';
import {DefaultRouteSettings, Globals} from '../../../constants/Globals';
import {DomainContext} from '../../../stores/DomainStore';
import {EXPERIMENT_LIST} from '../../../stores/ExperimentsStore';
import {ChannelsStackScreenProps} from '../../../types';

function Settings({navigation}: ChannelsStackScreenProps<'Settings'>) {
  const domain = React.useContext(DomainContext);
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

  const themeChange = (item: DropdownItem) => {
    domain.setTheme(item.value as Theme);
  };

  return (
    <Container flex={1} style={{padding: 10}}>
      <Container style={{minHeight: 80}}>
        <Text>Settings</Text>
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
        value={routeSettings.api}
        placeholder={DefaultRouteSettings.api}
        onChangeText={onSettingChange('api')}
        style={{marginVertical: 10}}
      />
      <TextInput
        label="CDN URL"
        value={routeSettings.cdn}
        placeholder={DefaultRouteSettings.cdn}
        onChangeText={onSettingChange('cdn')}
        style={{marginVertical: 10}}
      />
      <TextInput
        label="Gateway URL"
        value={routeSettings.gateway}
        placeholder={DefaultRouteSettings.gateway}
        onChangeText={onSettingChange('gateway')}
        style={{marginVertical: 10}}
      />
      <Hr style={{marginVertical: 10}} />
      {domain.experiments.isTreatmentEnabled('test', 0) && (
        <>
          <Text>Test experiment is enabled; Treatment 1</Text>
          <Hr style={{marginVertical: 10}} />
        </>
      )}
      {domain.experiments.isTreatmentEnabled('test', 1) && (
        <>
          <Text>Test experiment is enabled; Treatment 2</Text>
          <Hr style={{marginVertical: 10}} />
        </>
      )}

      <Text variant="headlineSmall">Experiments</Text>
      {EXPERIMENT_LIST.map(x => (
        <Container key={x.id} style={{minHeight: 100}}>
          <Text variant="bodyLarge">{x.name}</Text>
          <Text variant="labelLarge">{x.description}</Text>
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
        </Container>
      ))}
    </Container>
  );
}

export default observer(Settings);
