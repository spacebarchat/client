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
import BirthdayInput from '../components/BirthdayInput';
import Button from '../components/Button';
import Container from '../components/Container';
import HCaptcha, {HCaptchaMessage} from '../components/HCaptcha';
import useLogger from '../hooks/useLogger';
import {IAPIRegisterRequest, IAPIRegisterResponse} from '../interfaces/api';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme, RootStackScreenProps} from '../types';
import {Routes} from '../utils/Endpoints';
import {t} from '../utils/i18n';
import {messageFromFieldError} from '../utils/messageFromFieldError';

// const maxHeight = Dimensions.get('screen').height / 2.7;
const maxWidth = Dimensions.get('screen').width / 2.44;

// TODO: if the user is too young, store dob to localstorage and show age gate screen
function RegisterScreen({navigation}: RootStackScreenProps<'Register'>) {
  const theme = useTheme<CustomTheme>();
  const logger = useLogger('RegisterScreen.tsx');
  const domain = React.useContext(DomainContext);
  const [showPassword, setShowPassword] = React.useState(false);
  const [captchaSiteKey, setCaptchaSiteKey] = React.useState<string | null>(
    null,
  );
  const [captchaKey, setCaptchaKey] = React.useState<string>();
  const [captchaModalVisible, setCaptchaModalVisible] = React.useState(false);

  const hideCaptchaModal = () => setCaptchaModalVisible(false);
  const showCaptchaModal = () => setCaptchaModalVisible(true);

  const resetCaptcha = () => {
    setCaptchaSiteKey(null);
    setCaptchaKey(undefined);
  };

  const validationSchema = React.useMemo(
    () =>
      yup.object({
        email: yup.string().email(t('common:errors.INVALID_EMAIL') as string),
        username: yup
          .string()
          .min(1)
          .required(t('common:errors.FIELD_REQUIRED')!),
        password: yup.string().min(1),
        date_of_birth: yup.string().matches(/\d{4}-\d{2}-\d{2}/),
      }),
    [],
  );

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      date_of_birth: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      await domain.rest
        .post<IAPIRegisterRequest, IAPIRegisterResponse>(Routes.register(), {
          username: values.username,
          email: values.email,
          password: values.password,
          captcha_key: captchaKey,
          consent: true, // TODO: consent
          date_of_birth: values.date_of_birth,
        })
        .then(r => {
          if ('token' in r) {
            // success
            domain.setToken(r.token);
            return;
          } else if ('captcha_key' in r) {
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
                maxWidth,
                backgroundColor: theme.colors.palette.backgroundSecondary50,
              }
            : undefined,
        ]}>
        <Container horizontalCenter style={styles.headerContainer}>
          <Text variant="headlineSmall" style={{textAlign: 'center'}}>
            {t('register:TITLE')}
          </Text>
          <TouchableRipple
            rippleColor={theme.colors.link}
            onPress={() => navigation.navigate('Login')}>
            <Text
              variant="bodyMedium"
              style={{color: theme.colors.link, textAlign: 'center'}}>
              {t('register:LINK_LOGIN')}
            </Text>
          </TouchableRipple>
        </Container>

        <Container style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={t('register:LABEL_EMAIL')!}
              textContentType="emailAddress"
              keyboardType="email-address"
              autoFocus
              value={formik.values.email}
              onChangeText={value => {
                value = value.trim(); // trim whitespace, one case is autofill adding a space at the end
                formik.handleChange('email')(value);
              }}
              onBlur={formik.handleBlur('email')}
              disabled={formik.isSubmitting}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                formik.touched.email && Boolean(formik.errors.email)
                  ? {borderColor: theme.colors.error, borderWidth: 1}
                  : undefined,
              ]}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <HelperText
              type="error"
              visible={formik.touched.email && Boolean(formik.errors.email)}>
              {formik.errors.email}
            </HelperText>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder={t('register:LABEL_USERNAME')!}
              textContentType="username"
              keyboardType="ascii-capable"
              value={formik.values.username}
              onChangeText={formik.handleChange('username')}
              onBlur={formik.handleBlur('username')}
              disabled={formik.isSubmitting}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                formik.touched.username && Boolean(formik.errors.username)
                  ? {borderColor: theme.colors.error, borderWidth: 1}
                  : undefined,
              ]}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <HelperText type="info" visible>
              {t('register:USERNAME_HELPER')}
            </HelperText>
            <HelperText
              type="error"
              visible={
                formik.touched.username && Boolean(formik.errors.username)
              }>
              {formik.errors.username}
            </HelperText>
          </View>

          <View style={styles.inputContainer}>
            <Container
              row
              style={[
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderRadius: 5,
                },
                formik.touched.password && Boolean(formik.errors.password)
                  ? {borderColor: theme.colors.error, borderWidth: 1}
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
            <HelperText type="info" visible>
              {t('register:PASSWORD_HELPER', {
                min: 1,
                max: 72,
              })}
            </HelperText>
            <HelperText
              type="error"
              visible={
                formik.touched.password && Boolean(formik.errors.password)
              }>
              {formik.errors.password}
            </HelperText>
          </View>

          <View style={styles.inputContainer}>
            <Text>{t('register:INPUT_BIRTHDAY_LABEL')}</Text>
            <BirthdayInput
              onChange={formik.handleChange('date_of_birth')}
              disabled={formik.isSubmitting}
            />
            <HelperText
              type="error"
              visible={
                formik.touched.date_of_birth &&
                Boolean(formik.errors.date_of_birth)
              }>
              {formik.errors.date_of_birth}
            </HelperText>
          </View>

          <View style={[styles.inputContainer, styles.buttonSubmit]}>
            <Button
              mode="contained"
              onPress={() => formik.handleSubmit()}
              disabled={formik.isSubmitting}
              loading={formik.isSubmitting}>
              {t('register:BUTTON_REGISTER')}
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
  inputContainer: {
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
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
  buttonSubmit: {},
});

export default observer(RegisterScreen);
