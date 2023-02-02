import * as Localization from "expo-localization";
import { LanguageDetectorAsyncModule } from "i18next";
import Logger from "../Logger";

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: (callback: (locale: string) => void) => {
    const localeCode = Localization.getLocales()[0].languageCode;
    Logger.debug(`[LocaleDetector] Detected locale: ${localeCode}`);
    callback(localeCode);
    // callback("es_ES"); // forcing a different locale, for testing
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
export default languageDetector;
