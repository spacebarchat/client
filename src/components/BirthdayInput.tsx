import Color from 'color';
import {useFormik} from 'formik';
import React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputKeyPressEventData,
} from 'react-native';
import {Text, TextInput, useTheme} from 'react-native-paper';
import * as yup from 'yup';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme} from '../types';
import Container from './Container';

interface Props {
  onChange: (value: string) => void;
}

function BirthdayInput({onChange}: Props) {
  const domain = React.useContext(DomainContext);
  const theme = useTheme<CustomTheme>();
  const date = new Date();

  const monthRef = React.useRef<RNTextInput>(null);
  const dayRef = React.useRef<RNTextInput>(null);
  const yearRef = React.useRef<RNTextInput>(null);

  const validationSchema = React.useMemo(
    () =>
      yup.object({
        month: yup
          .string()
          .min(2)
          .max(2)
          .matches(/0[1-9]|1[0-2]/)
          .required(),
        day: yup
          .string()
          .min(2)
          .max(2)
          .matches(/(0[1-9]|[12]\d|3[01])/)
          .required(),
        year: yup.string().min(4).max(4).matches(/\d{4}/).required(),
      }),
    [],
  );

  const formik = useFormik({
    initialValues: {
      month: '',
      day: '',
      year: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    onSubmit: async values => {
      onChange(`${values.year}-${values.month}-${values.day}`);
    },
  });

  const handleChange = (field: string) => (e: string) => {
    formik.handleChange(field)(e);

    switch (field) {
      case 'month':
        if (e.length === 2) {
          dayRef.current?.focus();
        }
        break;
      case 'day':
        if (e.length === 2) {
          yearRef.current?.focus();
        }
        break;
    }
  };

  React.useEffect(() => {
    // submit when all fields are completed
    if (
      formik.values.month.length === 2 &&
      formik.values.day.length === 2 &&
      formik.values.year.length === 4
    ) {
      formik.submitForm();
    }
  }, [formik.values]);

  const onKeyPress =
    (field: string) =>
    ({nativeEvent}: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (nativeEvent.key !== 'Backspace') {
        return;
      }

      switch (field) {
        case 'year':
          if (formik.values.year.length === 0) {
            dayRef.current?.focus();
          }
          break;
        case 'day':
          if (formik.values.day.length === 0) {
            monthRef.current?.focus();
          }
      }
    };

  return (
    <Container
      row
      style={[
        styles.container,
        // {backgroundColor: theme.colors.surfaceVariant},
      ]}>
      <TextInput
        ref={monthRef}
        value={formik.values.month}
        onChangeText={handleChange('month')}
        placeholder={('00' + (date.getMonth() + 1)).slice(-2)}
        placeholderTextColor={theme.colors.text}
        style={[
          styles.input,
          formik.errors.month
            ? {borderColor: theme.colors.error, borderWidth: 1}
            : undefined,
        ]}
        underlineStyle={{backgroundColor: 'transparent'}}
        maxLength={2}
        onKeyPress={onKeyPress('month')}
        keyboardType="number-pad"
      />
      <Text
        style={{
          fontSize: 30,
          color: Color(theme.colors.text).lighten(0.5).hex(),
        }}>
        /
      </Text>
      <TextInput
        ref={dayRef}
        value={formik.values.day}
        onChangeText={handleChange('day')}
        placeholder={('00' + date.getDate()).slice(-2)}
        placeholderTextColor={theme.colors.text}
        style={[
          styles.input,
          formik.errors.day
            ? {borderColor: theme.colors.error, borderWidth: 1}
            : undefined,
        ]}
        underlineStyle={{backgroundColor: 'transparent'}}
        maxLength={2}
        onKeyPress={onKeyPress('day')}
        keyboardType="number-pad"
      />
      <Text
        style={{
          fontSize: 30,
          color: Color(theme.colors.text).lighten(0.5).hex(),
        }}>
        /
      </Text>
      <TextInput
        ref={yearRef}
        value={formik.values.year}
        onChangeText={handleChange('year')}
        placeholder={date.getFullYear().toString()}
        placeholderTextColor={theme.colors.text}
        style={[
          styles.input,
          formik.errors.year
            ? {borderColor: theme.colors.error, borderWidth: 1}
            : undefined,
        ]}
        underlineStyle={{backgroundColor: 'transparent'}}
        maxLength={4}
        onKeyPress={onKeyPress('year')}
        keyboardType="number-pad"
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    justifyContent: 'center',
  },
  input: {
    height: 'auto',
    flex: 1,
    alignSelf: 'center',
    borderRadius: 5,
  },
});

export default BirthdayInput;
