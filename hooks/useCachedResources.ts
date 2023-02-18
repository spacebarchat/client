// import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { Globals } from "../constants/Globals";
import { DomainContext } from "../stores/DomainStore";
import i18n from "../utils/i18n";
import Logger from "../utils/Logger";

export default function useCachedResources() {
  const logger = Logger.extend("useCachedResources");
  const domain = useContext(DomainContext);
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    if (isLoadingComplete && domain.isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isLoadingComplete, domain.isAppReady]);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // load "constant" globals
        await Globals.init();

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
          // ...FontAwesome.font,
          "source-sans-black": require("../assets/fonts/SourceSans/SourceSans3-Black.otf"),
          "source-sans-black-italic": require("../assets/fonts/SourceSans/SourceSans3-BlackIt.otf"),
          "source-sans-bold": require("../assets/fonts/SourceSans/SourceSans3-Bold.otf"),
          "source-sans-bold-italic": require("../assets/fonts/SourceSans/SourceSans3-BoldIt.otf"),
          "source-sans-extralight": require("../assets/fonts/SourceSans/SourceSans3-ExtraLight.otf"),
          "source-sans-extralight-italic": require("../assets/fonts/SourceSans/SourceSans3-ExtraLightIt.otf"),
          "source-sans-italic": require("../assets/fonts/SourceSans/SourceSans3-It.otf"),
          "source-sans-light": require("../assets/fonts/SourceSans/SourceSans3-Light.otf"),
          "source-sans-light-italic": require("../assets/fonts/SourceSans/SourceSans3-LightIt.otf"),
          "source-sans-regular": require("../assets/fonts/SourceSans/SourceSans3-Regular.otf"),
          "source-sans-semibold": require("../assets/fonts/SourceSans/SourceSans3-Semibold.otf"),
          "source-sans-semibold-italic": require("../assets/fonts/SourceSans/SourceSans3-SemiboldIt.otf"),

          "source-code-pro-black": require("../assets/fonts/SourceCodePro/SourceCodePro-Black.otf"),
          "source-code-pro-black-italic": require("../assets/fonts/SourceCodePro/SourceCodePro-BlackIt.otf"),
          "source-code-pro-bold": require("../assets/fonts/SourceCodePro/SourceCodePro-Bold.otf"),
          "source-code-pro-bold-italic": require("../assets/fonts/SourceCodePro/SourceCodePro-BoldIt.otf"),
          "source-code-pro-extralight": require("../assets/fonts/SourceCodePro/SourceCodePro-ExtraLight.otf"),
          "source-code-pro-extralight-italic": require("../assets/fonts/SourceCodePro/SourceCodePro-ExtraLightIt.otf"),
          "source-code-pro-italic": require("../assets/fonts/SourceCodePro/SourceCodePro-It.otf"),
          "source-code-pro-light": require("../assets/fonts/SourceCodePro/SourceCodePro-Light.otf"),
          "source-code-pro-light-italic": require("../assets/fonts/SourceCodePro/SourceCodePro-LightIt.otf"),
          "source-code-pro-regular": require("../assets/fonts/SourceCodePro/SourceCodePro-Regular.otf"),
          "source-code-pro-semibold": require("../assets/fonts/SourceCodePro/SourceCodePro-Semibold.otf"),
          "source-code-pro-semibold-italic": require("../assets/fonts/SourceCodePro/SourceCodePro-SemiboldIt.otf"),
        });

        // load token from storage
        domain.account.loadToken(domain);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete && domain.isAppReady;
}
