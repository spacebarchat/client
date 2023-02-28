import {useFormik} from 'formik';
import {observer} from 'mobx-react';
import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  HelperText,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import * as yup from 'yup';
import Button from '../components/Button';
import Container from '../components/Container';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme, RootStackScreenProps} from '../types';
import {t} from '../utils/i18n';

// const maxHeight = Dimensions.get('screen').height / 2.7;
const maxWidth = Dimensions.get('screen').width / 2.44;

function RegisterScreen({navigation}: RootStackScreenProps<'Register'>) {
  const theme = useTheme<CustomTheme>();
  const domain = React.useContext(DomainContext);
  const [showPassword, setShowPassword] = React.useState(false);

  const validationSchema = React.useMemo(
    () =>
      yup.object({
        login: yup.string().required(t('common:errors.FIELD_REQUIRED')!),
        username: yup.string().required(t('common:errors.FIELD_REQUIRED')!),
        password: yup.string().required(t('common:errors.FIELD_REQUIRED')!), // TODO: password requirement, discord has 6-72 characters
        // dob: yup.date().required(t('common:errors.FIELD_REQUIRED')!),
      }),
    [],
  );

  const formik = useFormik({
    initialValues: {
      login: '',
      username: '',
      password: '',
      dob: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      // TODO:
    },
  });

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <Container
      style={styles.container}
      flex={1}
      horizontalCenter
      verticalCenter>
      {Platform.isMobile && (
        <Container style={styles.buttonBack}>
          <IconButton icon="arrow-left" onPress={navigation.goBack} />
        </Container>
      )}

      <Container
        element={KeyboardAvoidingView}
        {...(Platform.isMobile ? {flex: 1, justifyContent: 'center'} : {})}
        style={[
          styles.contentContainer,
          !Platform.isMobile
            ? {
                maxWidth,
                backgroundColor: theme.colors.palette.neutral25,
              }
            : undefined,
        ]}>
        <Container horizontalCenter style={styles.headerContainer}>
          <Text variant="headlineSmall">{t('register:TITLE')}</Text>
          <TouchableRipple
            rippleColor={theme.colors.link}
            onPress={() => navigation.navigate('Login')}>
            <Text variant="bodyMedium" style={{color: theme.colors.link}}>
              {t('register:LINK_LOGIN')}
            </Text>
          </TouchableRipple>
        </Container>

        <Container style={styles.formContainer}>
          <View>
            <TextInput
              placeholder={t('register:LABEL_EMAIL')!}
              textContentType="emailAddress"
              keyboardType="email-address"
              autoFocus
              value={formik.values.login}
              onChangeText={formik.handleChange('login')}
              onBlur={formik.handleBlur('login')}
              style={[
                styles.input,
                formik.touched.login && Boolean(formik.errors.login)
                  ? styles.inputError
                  : undefined,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  color: theme.colors.onSurfaceVariant,
                },
              ]}
            />
            {formik.touched.login && Boolean(formik.errors.login) && (
              <HelperText type="error" visible>
                {formik.errors.login}
              </HelperText>
            )}
          </View>

          <View style={{marginTop: 10}}>
            <TextInput
              placeholder={t('register:LABEL_USERNAME')!}
              textContentType="username"
              keyboardType="ascii-capable"
              value={formik.values.username}
              onChangeText={formik.handleChange('username')}
              onBlur={formik.handleBlur('username')}
              style={[
                styles.input,
                formik.touched.username && Boolean(formik.errors.username)
                  ? styles.inputError
                  : undefined,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  color: theme.colors.onSurfaceVariant,
                },
              ]}
            />
            <HelperText type="info" visible>
              {t('register:USERNAME_HELPER')}
            </HelperText>
            {formik.touched.username && Boolean(formik.errors.username) && (
              <HelperText type="error" visible>
                {formik.errors.username}
              </HelperText>
            )}
          </View>

          <View>
            <Container
              row
              style={[
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderRadius: 5,
                  marginTop: 10,
                },
                formik.touched.password && Boolean(formik.errors.password)
                  ? styles.inputError
                  : undefined,
              ]}>
              <TextInput
                placeholder={t('register:LABEL_PASSWORD')!}
                secureTextEntry={!showPassword}
                textContentType="password"
                keyboardType="ascii-capable"
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    color: theme.colors.onSurfaceVariant,
                    flex: 1,
                  },
                ]}
              />
              <IconButton
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={togglePassword}
              />
            </Container>
            <HelperText type="info" visible>
              {t('register:PASSWORD_HELPER', {
                min: 6,
                max: 72,
              })}
            </HelperText>
            {formik.touched.password && Boolean(formik.errors.password) && (
              <HelperText type="error" visible>
                {formik.errors.password}
              </HelperText>
            )}
          </View>

          <View>
            <Button mode="contained" onPress={() => formik.handleSubmit()}>
              {t('register:BUTTON_CONTINUE')}
            </Button>
          </View>
        </Container>
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    marginBottom: 20,
  },
  formContainer: {},
  buttonBack: {
    alignSelf: 'flex-start',
  },
  contentContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 5,
    outlineStyle: 'none',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  forgotPassword: {alignSelf: 'flex-start', marginVertical: 10},
});

export default observer(RegisterScreen);
