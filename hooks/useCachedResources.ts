import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { DomainContext } from "../stores/DomainStore";
import i18n from "../utils/i18n";
import Logger from "../utils/Logger";

export default function useCachedResources() {
  const logger = Logger.extend("useCachedResources");
  const domain = useContext(DomainContext);
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // initialize localization
        await i18n
          .init()
          .then(() => {
            const RNDir = I18nManager.isRTL ? "RTL" : "LTR";
            // RN doesn't always correctly identify native
            // locale direction, so we force it here.
            if (i18n.dir !== RNDir) {
              const isLocaleRTL = i18n.dir === "RTL";
              I18nManager.forceRTL(isLocaleRTL);
              // RN won't set the layout direction if we
              // don't restart the app's JavaScript.
              // TODO: how do we reload the app?
            }

            domain.setI18NInitialized();
          })
          .catch((e) => {
            logger.warn("Something went wrong while initializing i18n:", e);
          });

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
