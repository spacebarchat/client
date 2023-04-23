import {
  RESTPostAPIGuildsJSONBody,
  RESTPostAPIGuildsResult,
} from '@spacebarchat/spacebar-api-types/v9';
import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import React from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import {useModal} from 'react-native-modalfy';
import {
  Button,
  HelperText,
  IconButton,
  Text,
  TextInput,
} from 'react-native-paper';
import * as yup from 'yup';
import {IAPIError} from '../../interfaces/api';
import {DomainContext} from '../../stores/DomainStore';
import {Routes} from '../../utils/Endpoints';
import Container from '../Container';

const {width, height} = Dimensions.get('window');

function CreateGuildModal() {
  const domain = React.useContext(DomainContext);
  const {closeModal, openModal, closeAllModals} = useModal();
  const navigation = useNavigation();

  const validationSchema = React.useMemo(
    () =>
      yup.object({
        name: yup.string(),
      }),
    [],
  );

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async values => {
      await domain.rest
        .post<RESTPostAPIGuildsJSONBody, RESTPostAPIGuildsResult | IAPIError>(
          Routes.guilds(),
          {
            name: values.name,
          },
        )
        .then(r => {
          if ('code' in r) {
            formik.setFieldError('name', r.message);
          } else {
            closeAllModals();
            navigation.navigate('App', {
              screen: 'Channel',
              params: {guildId: r.id},
            });
          }
        });
    },
  });

  const back = () => {
    closeModal('CreateGuild');
  };

  return (
    <Container style={styles.container} flex={1} horizontalCenter>
      <Container style={styles.closeButton}>
        <IconButton
          mode="contained"
          icon="close"
          onPress={() => closeAllModals}
        />
      </Container>

      <Container style={styles.headerContainer}>
        <Text variant="headlineLarge" style={styles.text}>
          Create a Guild
        </Text>
        <Text variant="bodyMedium" style={styles.text}>
          Enter some details for your guild
        </Text>
      </Container>
      <Container style={styles.contentContainer}>
        <HelperText type="info" visible>
          Guild Name
        </HelperText>
        <TextInput
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          editable={!formik.isSubmitting}
          style={styles.input}
        />
        {formik.errors.name && (
          <HelperText type="error">{formik.errors.name}</HelperText>
        )}
      </Container>
      <Container row>
        <Button
          mode="text"
          onPress={back}
          disabled={formik.isSubmitting}
          style={styles.actionButton}>
          Back
        </Button>
        <Button
          mode="contained"
          onPress={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
          style={styles.actionButton}>
          Create Guild
        </Button>
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212121',
    width: Platform.isMobile ? width : width / 4,
    borderRadius: 10,
    padding: 10,
  },
  headerContainer: {
    marginBottom: 50,
  },
  text: {
    textAlign: 'center',
  },
  actionButton: {
    marginHorizontal: 10,
  },
  contentContainer: {
    marginBottom: 10,
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 5,
  },
  input: {
    width: '100%',
  },
});

export default CreateGuildModal;
