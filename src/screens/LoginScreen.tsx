import {Link} from '@react-navigation/native';
import {useFormik} from 'formik';
import {observer} from 'mobx-react';
import React from 'react';
import {Platform, StyleSheet, useWindowDimensions} from 'react-native';
import {
  Button,
  HelperText,
  IconButton,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import * as yup from 'yup';
import Container from '../components/Container';
import HCaptcha, {HCaptchaMessage} from '../components/HCaptcha';
import MFAInput from '../components/MFAInput';
import useLogger from '../hooks/useLogger';
import {IAPILoginRequest, IAPILoginResponse} from '../interfaces/api';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme, RootStackScreenProps} from '../types';
import {Routes} from '../utils/Endpoints';
import {t} from '../utils/i18n';
import {messageFromFieldError} from '../utils/messageFromFieldError';

function LoginScreen({navigation}: RootStackScreenProps<'Login'>) {
  const dimensions = useWindowDimensions();
  const domain = React.useContext(DomainContext);
  const theme = useTheme<CustomTheme>();
  const logger = useLogger('LoginScreen');

  const [captchaModalVisible, setCaptchaModalVisible] = React.useState(false);
  const [captchaSiteKey, setCaptchaSiteKey] = React.useState<
    string | undefined
  >();
  const [captchaKey, setCaptchaKey] = React.useState<string | undefined>();
  const [shouldShowMFA, setShouldShowMFA] = React.useState(false);
  const [mfaTicket, setMFATicket] = React.useState<string | undefined>();
  const [shouldShowPassword, setShouldShowPassword] = React.useState(false);

  const hideCaptchaModal = () => setCaptchaModalVisible(false);
  const showCaptchaModal = () => setCaptchaModalVisible(true);

  const validationSchema = yup.object({
    login: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  // clears the captcha key and site key
  const resetCaptcha = () => {
    setCaptchaKey(undefined);
    setCaptchaSiteKey(undefined);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePasswordReset = async () => {
    if (formik.isSubmitting) {
      return;
    }

    formik.setTouched({login: true});

    if (!formik.values.login || formik.values.login === '') {
      formik.setFieldError('login', t('common:errors.INVALID_LOGIN') as string);
      return;
    }

    formik.setFieldError('login', 'Not Implemented');

    // formik.setSubmitting(true);

    // await domain.rest.post<IAPIPasswordResetRequest, never>(
    //   Routes.forgotPassword(),
    //   {
    //     login: formik.values.login,
    //   },
    // );
  };

  const submitForm = async (values: {login: string; password: string}) => {
    await domain.rest
      .post<IAPILoginRequest, IAPILoginResponse>(Routes.login(), {
        login: values.login,
        password: values.password,
        captcha_key: captchaKey,
      })
      .then(r => {
        if ('captcha_key' in r) {
          const {captcha_key, captcha_service, captcha_sitekey} = r;
          if (captcha_key[0] === 'captcha-required') {
            if (captcha_service === 'hcaptcha') {
              logger.debug('hCaptcha required');
              setCaptchaSiteKey(captcha_sitekey);
              showCaptchaModal();
              return;
            }

            formik.setFieldError(
              'login',
              `Unhandled captcha_service ${captcha_service}`,
            );
            resetCaptcha();
            return;
          }

          formik.setFieldError('login', `Unhandled captcha_key ${captcha_key}`);
          resetCaptcha();
          return;
        } else if ('mfa' in r) {
          // TODO: handle webauthn
          logger.debug('MFA Required');
          setShouldShowMFA(true);
          setMFATicket(r.ticket);
          return;
        } else if ('token' in r) {
          domain.account.setToken(r.token);
          resetCaptcha();
          return;
        } else {
          if ('code' in r) {
            if (r.code === 50035 && r.errors) {
              const t = messageFromFieldError(r.errors);
              if (t) {
                const {field, error} = t;
                formik.setFieldError(field ?? 'login', error);
                resetCaptcha();
                return;
              }
            }

            formik.setFieldError('login', r.message);
            resetCaptcha();
            return;
          }

          formik.setFieldError(
            'login',
            t('common:errors.UNKNOWN_ERROR') as string,
          );
          resetCaptcha();
          return;
        }
      });
  };

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    validationSchema,
    onSubmit: submitForm,
  });

  const onCaptchaMessage = (message: HCaptchaMessage) => {
    const {event, data} = message;
    switch (event) {
      case 'cancel':
        logger.debug('[HCaptcha] Captcha cancelled by user');
        hideCaptchaModal();
        break;
      case 'close':
        logger.debug('[HCaptcha] Captcha closed');
        break;
      case 'challenge-expired':
      case 'data-expired':
        logger.debug('[HCaptcha] Captcha expired');
        hideCaptchaModal();
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

  // Resubmit login request after captcha is completed
  React.useEffect(() => {
    if (!captchaKey) {
      return;
    }

    setCaptchaSiteKey(undefined);

    submitForm(formik.values);
  }, [captchaKey]);

  if (shouldShowMFA && mfaTicket) {
    return (
      <MFAInput close={() => setShouldShowMFA(false)} mfaTicket={mfaTicket} />
    );
  }

  return (
    <Container testID="mainContainer" horizontalCenter verticalCenter flexOne>
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
        testID="innerContainer"
        style={[
          styles.loginContainer,
          {
            minWidth: !Platform.isMobile
              ? dimensions.width / 2.5
              : dimensions.width,
          },
        ]}
        element={Surface}
        elevation={1}>
        <Container
          testID="contentContainer"
          verticalCenter
          style={styles.contentContainer}>
          {/* Mobile Back Button */}
          {Platform.isMobile && (
            <IconButton
              icon="arrow-left"
              size={20}
              onPress={handleBack}
              style={styles.mobileBack}
            />
          )}
          {/* Header */}
          <Container testID="headerContainer" horizontalCenter>
            <Text variant="headlineSmall" style={{fontWeight: '600'}}>
              {t('login:TITLE')}
            </Text>
            {!Platform.isMobile && (
              <Link to={{screen: 'Register'}} style={styles.link}>
                <Text
                  variant="bodyLarge"
                  style={[{fontWeight: '400', marginRight: 5}, styles.link]}>
                  {t('login:NEED_ACCOUNT')}
                </Text>
              </Link>
            )}
          </Container>

          <Container testID="formContainer" style={styles.formContainer}>
            <Container testID="emailWrapper">
              <TextInput
                label="Email"
                textContentType="emailAddress"
                returnKeyType="next"
                onChangeText={formik.handleChange('login')}
                onBlur={formik.handleBlur('login')}
                value={formik.values.login}
                error={formik.touched.login && Boolean(formik.errors.login)}
                style={styles.input}
              />
              <HelperText
                type="error"
                visible={formik.touched.login && Boolean(formik.errors.login)}>
                {formik.touched.login && formik.errors.login}
              </HelperText>
            </Container>

            <Container>
              <TextInput
                label="Password"
                textContentType="password"
                secureTextEntry={!shouldShowPassword}
                returnKeyType="done"
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                style={styles.input}
                right={
                  <TextInput.Icon
                    icon={shouldShowPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShouldShowPassword(!shouldShowPassword)}
                    iconColor={theme.colors.primary}
                    disabled={formik.isSubmitting}
                  />
                }
              />
              <HelperText
                type="error"
                visible={
                  formik.touched.password && Boolean(formik.errors.password)
                }>
                {formik.touched.password && formik.errors.password}
              </HelperText>

              <Text style={styles.link} onPress={handlePasswordReset}>
                {t('login:LABEL_FORGOT_PASSWORD')}
              </Text>
            </Container>

            <Button
              testID="loginButton"
              mode="contained"
              disabled={formik.isSubmitting}
              loading={!Platform.isWindows && formik.isSubmitting}
              onPress={() => formik.handleSubmit()}
              style={styles.button}
              labelStyle={styles.buttonLabel}>
              {t('login:BUTTON_LOGIN')}
            </Button>
          </Container>
        </Container>
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  mobileBack: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loginContainer: {
    // minWidth: 800,
    // minHeight: 400,
    padding: 32,
    borderRadius: 8,
  },
  contentContainer: {
    height: '100%',
  },
  formContainer: {
    marginVertical: 32,
  },
  input: {
    marginVertical: 8,
  },
  helperText: {
    fontStyle: 'italic',
  },
  link: {
    color: '#7289da',
  },
  buttonLabel: {fontWeight: '400', fontSize: 16},
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
  },
});

export default observer(LoginScreen);
