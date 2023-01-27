import React from "react";
import { Platform, StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Container from "../components/Container";
import { RootStackScreenProps } from "../types";

function RegisterScreen({ navigation }: RootStackScreenProps<"Register">) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Container horizontalCenter verticalCenter flexOne>
      {/* Mobile Back Button */}
      {Platform.isMobile && (
        <IconButton
          icon="arrow-left"
          size={20}
          onPress={handleBack}
          style={styles.mobileBack}
        />
      )}
      <Text>Register Screen</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  mobileBack: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default RegisterScreen;
