import * as Localization from "expo-localization";
import { LanguageDetectorAsyncModule } from "i18next";
import useLogger from "../../hooks/useLogger";

export const localeLogger = useLogger("Locale");

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: (callback: (locale: string) => void) => {
    const localeCode = Localization.getLocales()[0].languageCode;
    localeLogger.info(`Detected locale: ${localeCode}`);
    callback(localeCode);
    // callback("es"); // forcing a different locale, for testing
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
export default languageDetector;
