import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { RootStackScreenProps } from "../types";
import { t } from "../utils/i18n";

export default function NotFoundScreen({
  navigation,
}: RootStackScreenProps<"NotFound">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("NotFoundScreen:title")}</Text>
      <TouchableRipple
        onPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.replace("Root")
        }
        style={styles.link}
      >
        <Text style={styles.linkText}>
          {t(
            navigation.canGoBack()
              ? "NotFoundScreen:go_back"
              : "NotFoundScreen:go_home"
          )}
        </Text>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
