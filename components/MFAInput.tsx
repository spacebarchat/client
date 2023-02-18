import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import {
  Button,
  HelperText,
  IconButton,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import useLogger from "../hooks/useLogger";
import { IAPIMFAResponse, TotpSchema } from "../interfaces/api";
import { DomainContext } from "../stores/DomainStore";
import { Routes } from "../utils/Endpoints";
import { t } from "../utils/i18n";
import Container from "./Container";

interface MFAInputProps {
  close: () => void;
  mfaTicket: string;
}

function MFAInput({ close, mfaTicket }: MFAInputProps) {
  const dimensions = useWindowDimensions();
  const domain = React.useContext(DomainContext);
  const logger = useLogger("MFAInput");
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [errors, setErrors] = React.useState<{
    code?: string;
  }>({ code: "" });

  const handleSubmit = (e: GestureResponderEvent) => {
    if (isLoading && !code) return;
    e.preventDefault();
    setIsLoading(true);

    if (!code || code == "" || code.length < 6 || code.length > 8) {
      setErrors({
        code: t("common:errors.INVALID_OTP") as string,
      });
      setIsLoading(false);
      return;
    }

    domain.rest
      .post<TotpSchema, IAPIMFAResponse>(Routes.totp(), {
        code,
        ticket: mfaTicket,
      })
      .then((res) => {
        // TODO: process field errors

        if ("token" in res) {
          logger.debug("success", res);
          domain.account.setToken(res.token);
          setIsLoading(false);
          navigation.navigate("App");
          return;
        } else {
          if (res.code === 60008) {
            setErrors({
              code: t("common:errors.INVALID_OTP") as string,
            });
            setIsLoading(false);
            return;
          }

          if ("message" in res) {
            setErrors({
              code: res.message,
            });
            return;
          }

          setErrors({
            code: t("common:errors.UNEXPECTED_ERROR") as string,
          });
          return;
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setErrors({
          code: e.message,
        });
      });
  };

  return (
    <Container testID="mainContainer" horizontalCenter verticalCenter flexOne>
      <Surface
        testID="innerContainer"
        style={[
          styles.innerContainer,
          {
            minWidth: !Platform.isMobile
              ? dimensions.width / 2.5
              : dimensions.width,
          },
        ]}
      >
        <Container
          testID="contentContainer"
          verticalCenter
          style={styles.contentContainer}
        >
          {/* Mobile Back Button */}
          {Platform.isMobile && (
            <IconButton
              icon="arrow-left"
              size={20}
              onPress={() => {}}
              style={styles.mobileBack}
            />
          )}
          {/* Header */}
          <Container testID="headerContainer" horizontalCenter>
            <Text variant="headlineSmall" style={{ fontWeight: "600" }}>
              {t("login:MFA_TITLE")}
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              {t("login:MFA_SUBTITLE")}
            </Text>
          </Container>

          {/* Form */}
          <Container testID="formContainer" style={styles.formContainer}>
            {/* OTP */}
            <Container testID="otpWrapper">
              <TextInput
                label={t("login:LABEL_OTP") as string}
                textContentType="oneTimeCode"
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                style={styles.input}
                disabled={isLoading}
                error={!!errors.code}
                maxLength={8}
              />
              <HelperText
                type="error"
                visible={!!errors.code}
                style={styles.helperText}
              >
                {errors.code}
              </HelperText>
            </Container>

            {/* Login Button */}
            <Button
              mode="contained"
              disabled={isLoading}
              loading={isLoading}
              onPress={handleSubmit}
              style={{ marginVertical: 16 }}
              labelStyle={styles.buttonLabel}
            >
              {t("login:BUTTON_LOGIN")}
            </Button>

            {/* Back to Login Link */}
            <Pressable onPress={close}>
              <Text
                style={
                  // @ts-ignore
                  [styles.link]
                }
              >
                {t("login:BACK_TO_LOGIN")}
              </Text>
            </Pressable>
          </Container>
        </Container>
      </Surface>
    </Container>
  );
}

const styles = StyleSheet.create({
  mobileBack: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  subtitle: {
    fontWeight: "400",
    marginRight: 5,
    textAlign: "center",
    maxWidth: "50%",
    flex: 1,
    flexWrap: "wrap",
  },
  innerContainer: {
    padding: 32,
    borderRadius: 8,
  },
  contentContainer: {
    height: "100%",
  },
  formContainer: {
    marginVertical: 32,
  },
  input: {
    marginVertical: 8,
  },
  helperText: {
    fontStyle: "italic",
  },
  link: {
    color: "#7289da",
    cursor: "pointer",
  },
  buttonLabel: { fontWeight: "400", fontSize: 16 },
});

export default MFAInput;
