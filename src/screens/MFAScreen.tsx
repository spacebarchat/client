import {useNavigation} from '@react-navigation/native';
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
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import * as yup from 'yup';
import Button from '../components/Button';
import Container from '../components/Container';
import {IAPITOTPRequest, IAPITOTPResponse} from '../interfaces/api';
import {DomainContext} from '../stores/DomainStore';
import {CustomTheme} from '../types';
import {Routes} from '../utils/Endpoints';
import {t} from '../utils/i18n';
import {messageFromFieldError} from '../utils/messageFromFieldError';

const maxHeight = Dimensions.get('screen').height / 2.7;
const maxWidth = Dimensions.get('screen').width / 2.44;

interface MFAProps {
  ticket: string;
}

function MFAScreen({ticket}: MFAProps) {
  const theme = useTheme<CustomTheme>();
  const navigation = useNavigation();
  const domain = React.useContext(DomainContext);

  const validationSchema = React.useMemo(
    () =>
      yup.object({
        code: yup
          .string()
          .matches(/^[0-9]+$/, t('common:errors.INVALID_OTP') as string)
          .min(6)
          .max(6)
          .required(t('common:errors.FIELD_REQUIRED') as string),
      }),
    [],
  );

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      await domain.rest
        .post<IAPITOTPRequest, IAPITOTPResponse>(Routes.totp(), {
          code: values.code,
          ticket,
        })
        .then(r => {
          if ('token' in r) {
            // success
            domain.setToken(r.token);
            return;
          } else if ('message' in r) {
            // error
            if (r.errors) {
              const t = messageFromFieldError(r.errors);
              if (t) {
                formik.setFieldError(t.field!, t.error);
              } else {
                formik.setFieldError('code', r.message);
              }
            } else {
              formik.setFieldError('code', r.message);
            }
          } else {
            // unknown error
            formik.setFieldError(
              'code',
              t('common:errors.UNKNOWN_ERROR') as string,
            );
          }
        });
    },
  });

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
                maxHeight,
                maxWidth,
                backgroundColor: theme.colors.palette.backgroundSecondary50,
              }
            : undefined,
        ]}>
        <Container horizontalCenter style={styles.headerContainer}>
          <Text variant="headlineSmall" style={{textAlign: 'center'}}>
            {t('login:MFA_TITLE')}
          </Text>
          <Text variant="bodyMedium" style={{textAlign: 'center'}}>
            {t('login:MFA_SUBTITLE')}
          </Text>
        </Container>

        <Container style={styles.formContainer}>
          <View style={{marginBottom: 10}}>
            <TextInput
              placeholder={t('login:LABEL_OTP')!}
              textContentType={'oneTimeCode'}
              keyboardType="number-pad"
              value={formik.values.code}
              onChangeText={formik.handleChange('code')}
              onBlur={formik.handleBlur('code')}
              autoFocus
              disabled={formik.isSubmitting}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                formik.touched.code && formik.errors.code
                  ? {borderColor: theme.colors.error, borderWidth: 1}
                  : undefined,
              ]}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            {formik.touched.code && formik.errors.code && (
              <HelperText type="error" visible>
                {formik.errors.code}
              </HelperText>
            )}
          </View>

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

export default observer(MFAScreen);
