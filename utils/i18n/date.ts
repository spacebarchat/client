import { FormatFunction } from "i18next";
import moment from "moment";
import * as config from "./i18n";

const date: {
  init(locale: string): Promise<void>;
  format: FormatFunction;
} = {
  init(locale) {
    return new Promise((resolve, reject) => {
      config.supportedLocales[locale]
        .momentLocaleLoader()
        .then(() => {
          moment.locale(locale);
          return resolve();
        })
        .catch(reject);
    });
  },
  format(date, format) {
    return moment(date).format(format);
  },
};
export default date;
