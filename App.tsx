import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CombinedDarkTheme, CombinedLightTheme } from "./constants/Colors";

import { observer } from "mobx-react";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import { RootNavigator } from "./navigation";
import linking from "./navigation/LinkingConfiguration";
import { DomainContext } from "./stores/DomainStore";

Platform.isDesktop = Platform.OS === "macos" || Platform.OS === "windows";
Platform.isMobile = Platform.OS === "ios" || Platform.OS === "android";
Platform.isWeb = Platform.OS === "web";

function App() {
  if (
    !new (class {
      x: any;
    })().hasOwnProperty("x")
  )
    throw new Error("Transpiler is not configured correctly");

  const domain = React.useContext(DomainContext);
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    // TODO: try to get the theme from storage
    domain.setDarkTheme(colorScheme === "dark");

    // load token from storage
    domain.account.loadToken();
  }, []);

  React.useEffect(() => {
    if (!domain.account.token) return;

    domain.gateway.connect(
      "wss://slowcord.understars.dev/",
      domain.account.token
    );
  }, [domain.account.token]);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider
          theme={domain.isDarkTheme ? CombinedDarkTheme : CombinedLightTheme}
        >
          <SafeAreaProvider>
            <NavigationContainer
              linking={linking}
              theme={
                domain.isDarkTheme ? CombinedDarkTheme : CombinedLightTheme
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

export default observer(App);
