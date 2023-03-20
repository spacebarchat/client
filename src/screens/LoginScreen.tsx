import {useFormik} from 'formik';
import {observer} from 'mobx-react';
import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {
  HelperText,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import * as yup from 'yup';
import Button from '../components/Button';
import Container from '../components/Container';
import HCaptcha, {HCaptchaMessage} from '../components/HCaptcha';
import useLogger from '../hooks/useLogger';
import {
  IAPILoginRequest,
  IAPILoginResponse,
  IAPILoginResponseError,
} from '../interfaces/api';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme, RootStackScreenProps} from '../types';
import {Routes} from '../utils/Endpoints';
import {t} from '../utils/i18n';
import {messageFromFieldError} from '../utils/messageFromFieldError';
import MFAScreen from './MFAScreen';

const maxHeight = Dimensions.get('screen').height / 2.7;
const maxWidth = Dimensions.get('screen').width / 2.44;

function LoginScreen({navigation}: RootStackScreenProps<'Login'>) {
  const theme = useTheme<CustomTheme>();
  const logger = useLogger('LoginScreen.tsx');
  const domain = React.useContext(DomainContext);
  const [showPassword, setShowPassword] = React.useState(false);
  const [captchaSiteKey, setCaptchaSiteKey] = React.useState<string | null>(
    null,
  );
  const [captchaKey, setCaptchaKey] = React.useState<string>();
  const [captchaModalVisible, setCaptchaModalVisible] = React.useState(false);
  const [mfaTicket, setMfaTicket] = React.useState<string>();

  const hideCaptchaModal = () => setCaptchaModalVisible(false);
  const showCaptchaModal = () => setCaptchaModalVisible(true);

  const resetCaptcha = () => {
    setCaptchaSiteKey(null);
    setCaptchaKey(undefined);
  };

  const validationSchema = React.useMemo(
    () =>
      yup.object({
        login: yup
          .string()
          .email(t('common:errors.INVALID_EMAIL') as string)
          .required(t('common:errors.FIELD_REQUIRED') as string),
        password: yup
          .string()
          .required(t('common:errors.FIELD_REQUIRED') as string),
      }),
    [],
  );

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      await domain.rest
        .post<IAPILoginRequest, IAPILoginResponse>(Routes.login(), {
          login: values.login,
          password: values.password,
          undelete: false,
          captcha_key: captchaKey,
        })
        .then(r => {
          if ('token' in r && 'settings' in r) {
            // success
            domain.setToken(r.token);
            return;
          } else if ('ticket' in r) {
            // mfa
            setMfaTicket(r.ticket);
            return;
          } else {
            // unknown error
            formik.setFieldError(
              'login',
              t('common:errors.UNKNOWN_ERROR') as string,
            );
            resetCaptcha();
          }
        })
        .catch((r: IAPILoginResponseError) => {
          if ('captcha_key' in r) {
            // catcha required
            if (r.captcha_key[0] !== 'captcha-required') {
              // some kind of captcha error
              formik.setFieldError(
                'login',
                `Captcha Error: ${r.captcha_key[0]}`,
              );
            } else if (r.captcha_service !== 'hcaptcha') {
              // recaptcha or something else
              formik.setFieldError(
                'login',
                `Unsupported captcha service: ${r.captcha_service}`,
              );
            } else {
              // hcaptcha
              setCaptchaSiteKey(r.captcha_sitekey);
              showCaptchaModal();
              return;
            }

            resetCaptcha();
          } else if ('message' in r) {
            // error
            if (r.errors) {
              const t = messageFromFieldError(r.errors);
              if (t) {
                formik.setFieldError(t.field!, t.error);
              } else {
                formik.setFieldError('login', r.message);
              }
            } else {
              formik.setFieldError('login', r.message);
            }

            resetCaptcha();
          } else {
            // unknown error
            formik.setFieldError(
              'login',
              t('common:errors.UNKNOWN_ERROR') as string,
            );
            resetCaptcha();
          }
        });
    },
  });

  const togglePassword = () => setShowPassword(!showPassword);

  const forgotPasswordPress = async () => {
    await formik.setTouched({login: true}, true);

    if (!formik.values.login || formik.values.login === '') {
      formik.setFieldError('login', t('common:errors.INVALID_LOGIN') as string);
      return;
    }

    // formik.setSubmitting(true);
    formik.setFieldError('login', 'Not implemented');

    // await domain.rest.post<IAPIPasswordResetRequest, never>(
    //   Routes.forgotPassword(),
    //   {
    //     login: formik.values.login,
    //   },
    // );
  };

  const onCaptchaMessage = (message: HCaptchaMessage) => {
    const {event, data} = message;
    switch (event) {
      case 'cancel':
        logger.debug('[HCaptcha] Captcha cancelled by user');
        hideCaptchaModal();
        formik.setFieldError('login', 'Captcha cancelled by user');
        break;
      case 'close':
        logger.debug('[HCaptcha] Captcha closed');
        break;
      case 'challenge-expired':
      case 'data-expired':
        logger.debug('[HCaptcha] Captcha expired');
        hideCaptchaModal();
        formik.setFieldError('login', 'Captcha expired');
        break;
      case 'open':
        logger.debug('[HCaptcha] Captcha opened');
        break;
      case 'error':
        logger.error('[HCaptcha] Captcha error', data);
        hideCaptchaModal();
        break;
      case 'data':
        logger.debug('[HCaptcha] Captcha data', data);
        hideCaptchaModal();
        setCaptchaKey(data);
        break;
    }
  };

  React.useEffect(() => {
    if (!captchaKey) {
      return;
    }
    formik.submitForm();
  }, [captchaKey]);

  if (mfaTicket) {
    return <MFAScreen ticket={mfaTicket} />;
  }

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
      <Portal>
        <Modal
          visible={captchaModalVisible}
          onDismiss={() => {
            hideCaptchaModal();
            formik.setSubmitting(false);
          }}
          style={styles.modalContainer}
          contentContainerStyle={styles.modalContentContainer}>
          {captchaSiteKey && (
            <HCaptcha siteKey={captchaSiteKey} onMessage={onCaptchaMessage} />
          )}
        </Modal>
      </Portal>

      <Container
        element={KeyboardAvoidingView}
        {...(Platform.isMobile ? {flex: 1, justifyContent: 'center'} : {})}
        style={[
          styles.contentContainer,
          !Platform.isMobile
            ? {
                maxHeight,
                maxWidth,
                backgroundColor: theme.colors.palette.backgroundSecondary50,
              }
            : undefined,
        ]}>
        <Container horizontalCenter style={styles.headerContainer}>
          <Text variant="headlineSmall" style={{textAlign: 'center'}}>
            {t('login:TITLE')}
          </Text>
          <TouchableRipple
            rippleColor={theme.colors.link}
            onPress={() => navigation.navigate('Register')}
            disabled={formik.isSubmitting}>
            <Text
              variant="bodyMedium"
              style={{color: theme.colors.link, textAlign: 'center'}}>
              {t('login:NEED_ACCOUNT')}
            </Text>
          </TouchableRipple>
        </Container>

        <Container style={styles.formContainer}>
          <View>
            <TextInput
              placeholder={t('login:LABEL_LOGIN')!}
              textContentType={
                isNaN(Number(formik.values.login))
                  ? 'emailAddress'
                  : 'telephoneNumber'
              }
              keyboardType="ascii-capable"
              value={formik.values.login}
              onChangeText={value => {
                value = value.trim(); // trim whitespace, one case is autofill adding a space at the end
                formik.handleChange('login')(value);
              }}
              onBlur={formik.handleBlur('login')}
              autoFocus
              disabled={formik.isSubmitting}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                formik.touched.login && formik.errors.login
                  ? {borderColor: theme.colors.error, borderWidth: 1}
                  : undefined,
              ]}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            {formik.touched.login && formik.errors.login && (
              <HelperText type="error" visible>
                {formik.errors.login}
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
                formik.touched.password && formik.errors.password
                  ? {borderColor: theme.colors.error, borderWidth: 1}
                  : undefined,
              ]}>
              <TextInput
                placeholder={t('login:LABEL_PASSWORD')!}
                secureTextEntry={!showPassword}
                textContentType="password"
                keyboardType="ascii-capable"
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                disabled={formik.isSubmitting}
                autoCapitalize="none"
                autoCorrect={false}
                style={[
                  styles.input,
                  {
                    flex: 1,
                  },
                ]}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
              <IconButton
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={togglePassword}
              />
            </Container>
            {formik.touched.password && formik.errors.password && (
              <HelperText type="error" visible>
                {formik.errors.password}
              </HelperText>
            )}
          </View>

          <TouchableRipple
            rippleColor={theme.colors.link}
            style={styles.forgotPassword}
            onPress={forgotPasswordPress}
            disabled={formik.isSubmitting}>
            <Text variant="bodyMedium" style={{color: theme.colors.link}}>
              {t('login:LABEL_FORGOT_PASSWORD')}
            </Text>
          </TouchableRipple>

          <View>
            <Button
              mode="contained"
              onPress={() => formik.handleSubmit()}
              disabled={formik.isSubmitting}
              loading={formik.isSubmitting}>
              {t('login:BUTTON_LOGIN')}
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
  forgotPassword: {alignSelf: 'flex-start', marginVertical: 10},
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default observer(LoginScreen);
