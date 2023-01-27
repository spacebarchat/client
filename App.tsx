import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CombinedDarkTheme, CombinedLightTheme } from "./constants/Colors";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import { RootNavigator } from "./navigation";
import linking from "./navigation/LinkingConfiguration";

Platform.isDesktop = Platform.OS === "macos" || Platform.OS === "windows";
Platform.isMobile = Platform.OS === "ios" || Platform.OS === "android";
Platform.isWeb = Platform.OS === "web";

export default function App() {
  if (
    !new (class {
      x: any;
    })().hasOwnProperty("x")
  )
    throw new Error("Transpiler is not configured correctly");

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider
          theme={
            colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme
          }
        >
          <SafeAreaProvider>
            <NavigationContainer
              linking={linking}
              theme={
                colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme
              }
            >
              <RootNavigator />
            </NavigationContainer>
            <StatusBar />
          </SafeAreaProvider>
        </PaperProvider>
      </GestureHandlerRootView>
    );
  }
}
