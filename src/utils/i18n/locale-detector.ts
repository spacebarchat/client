import {LanguageDetectorAsyncModule} from 'i18next';
import * as RNLocalize from 'react-native-localize';
import useLogger from '../../hooks/useLogger';

// eslint-disable-next-line react-hooks/rules-of-hooks
export const localeLogger = useLogger('Locale');

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (locale: string) => void) => {
    const localeCode = RNLocalize.getLocales()[0].languageCode;
    localeLogger.info(`Detected locale: ${localeCode}`);
    callback(localeCode);
    // callback("es"); // forcing a different locale, for testing
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
export default languageDetector;
