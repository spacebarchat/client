import * as Localization from "expo-localization";
import { LanguageDetectorAsyncModule } from "i18next";

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: (callback: (locale: string) => void) => {
    callback(Localization.getLocales()[0].languageCode);
    // callback("es"); // forcing a different locale, for testing
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
export default languageDetector;
