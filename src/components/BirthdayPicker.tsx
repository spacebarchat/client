import React from 'react';
import {StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useTheme} from 'react-native-paper';
import {Themes} from '../constants/Colors';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme} from '../types';
import Container from './Container';

interface Props {
  onChange: (value: string) => void;
}

function BirthdayPicker({onChange}: Props) {
  const domain = React.useContext(DomainContext);
  const theme = useTheme<CustomTheme>();

  const [months] = React.useState([
    {label: 'January', value: '01'},
    {label: 'February', value: '02'},
    {label: 'March', value: '03'},
    {label: 'April', value: '04'},
    {label: 'May', value: '05'},
    {label: 'June', value: '06'},
    {label: 'July', value: '07'},
    {label: 'August', value: '08'},
    {label: 'September', value: '09'},
    {label: 'October', value: '10'},
    {label: 'November', value: '11'},
    {label: 'December', value: '12'},
  ]);
  const [days] = React.useState(
    Array.from(Array(31).keys()).map(x => {
      const v = x + 1;
      return {label: v.toString(), value: v.toString()};
    }),
  );

  // current year - 3, and go back 73 years
  const [years] = React.useState(
    Array.from(Array(71).keys()).map(x => {
      const v = new Date().getFullYear() - 3 - x;
      return {label: v.toString(), value: v.toString()};
    }),
  );

  const [month, setMonth] = React.useState<string | null>(null);
  const [day, setDay] = React.useState<string | null>(null);
  const [year, setYear] = React.useState<string | null>(null);

  const [monthOpen, setMonthOpen] = React.useState(false);
  const [dayOpen, setDayOpen] = React.useState(false);
  const [yearOpen, setYearOpen] = React.useState(false);

  // this is inverted for the arrow icons, we could probably just replace them with something like material icons though
  const pickerTheme = domain.theme.name === Themes.DARK ? 'LIGHT' : 'DARK';

  const onMonthOpen = React.useCallback(() => {
    setDayOpen(false);
    setYearOpen(false);
  }, []);

  const onDayOpen = React.useCallback(() => {
    setMonthOpen(false);
    setYearOpen(false);
  }, []);

  const onYearOpen = React.useCallback(() => {
    setMonthOpen(false);
    setDayOpen(false);
  }, []);

  const handleChange = (type: string) => (value: string | null) => {
    switch (type) {
      case 'month':
        setMonth(value);
        break;
      case 'day':
        setDay(value);
        break;
      case 'year':
        setYear(value);
        break;
    }

    if (month && day && year) {
      const date = new Date(`${year}-${month}-${day}`);
      onChange(date.toISOString().split('T')[0]);
    }
  };

  return (
    <Container row flex={1} style={styles.container}>
      <DropDownPicker
        placeholder="Month"
        theme={pickerTheme}
        open={monthOpen}
        value={month}
        items={months}
        setOpen={setMonthOpen}
        setValue={setMonth}
        onChangeValue={handleChange('month')}
        onOpen={onMonthOpen}
        containerStyle={styles.picker}
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: 'transparent',
          width: 'auto',
        }}
        dropDownContainerStyle={{
          backgroundColor: theme.colors.palette.backgroundSecondary70,
          borderColor: 'transparent',
        }}
        textStyle={{color: theme.colors.whiteBlack}}
        zIndex={1000}
        zIndexInverse={3000}
        closeAfterSelecting
      />
      <DropDownPicker
        placeholder="Day"
        theme={pickerTheme}
        open={dayOpen}
        value={day}
        items={days}
        setOpen={setDayOpen}
        setValue={setDay}
        onChangeValue={handleChange('day')}
        onOpen={onDayOpen}
        containerStyle={[styles.picker, {marginHorizontal: 10}]}
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: 'transparent',
          width: 'auto',
        }}
        dropDownContainerStyle={{
          backgroundColor: theme.colors.palette.backgroundSecondary70,
          borderColor: 'transparent',
        }}
        textStyle={{color: theme.colors.whiteBlack}}
        zIndex={2000}
        zIndexInverse={2000}
        closeAfterSelecting
      />
      <DropDownPicker
        placeholder="Year"
        theme={pickerTheme}
        open={yearOpen}
        value={year}
        items={years}
        setOpen={setYearOpen}
        setValue={setYear}
        onChangeValue={handleChange('year')}
        onOpen={onYearOpen}
        containerStyle={styles.picker}
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: 'transparent',
          width: 'auto',
        }}
        dropDownContainerStyle={{
          backgroundColor: theme.colors.palette.backgroundSecondary70,
          borderColor: 'transparent',
        }}
        textStyle={{color: theme.colors.whiteBlack}}
        arrowIconStyle={{shadowColor: theme.colors.whiteBlack}}
        zIndex={3000}
        zIndexInverse={1000}
        closeAfterSelecting
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  picker: {
    flex: 1,
  },
});

export default BirthdayPicker;
