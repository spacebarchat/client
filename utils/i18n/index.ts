import i18next from "i18next";
import { I18nManager as RNI18nManager } from "react-native";
import date from "./date";
import * as config from "./i18n";
import localeDetector from "./locale-detector";
import translationLoader from "./translation-loader";

const i18n = {
  init: () => {
    return new Promise((resolve, reject) => {
      i18next
        .use(localeDetector)
        .use(translationLoader)
        .init(
          {
            preload: config.supportedLocales,
            fallbackLng: config.fallback,
            ns: config.namespaces,
            load: "languageOnly",
            compatibilityJSON: "v3",
            interpolation: {
              escapeValue: false,
              format(value, format) {
                if (value instanceof Date) {
                  return date.format(value, format);
                }
                return value;
              },
            },
          },
          (error: unknown) => {
            if (error) {
              return reject(error);
            }
            date
              .init(i18next.language)
              .then(resolve)
              .catch((error) => reject(error));
          }
        );
    });
  },
  t: i18next.t,
  get locale() {
    return i18next.language;
  },
  get dir() {
    return i18next.dir().toUpperCase();
  },
  get isRTL() {
    return RNI18nManager.isRTL;
  },
  select(map: { rtl: unknown; ltr: unknown }) {
    const key = this.isRTL ? "rtl" : "ltr";
    return map[key];
  },
};
export const t = i18n.t;
export default i18n;
