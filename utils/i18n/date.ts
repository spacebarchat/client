import { FormatFunction } from "i18next";
import moment from "moment";

// FIXME: see i18n tryImportMomentLocale
const date: {
  init(locale: string): Promise<void>;
  format: FormatFunction;
} = {
  init(locale) {
    return new Promise((resolve, reject) => {
      resolve();
      // config
      //   .tryImportMomentLocale(locale)
      //   .then(() => {
      //     moment.locale(locale);
      //     return resolve();
      //   })
      //   .catch(reject);
    });
  },
  format(date, format) {
    return moment(date).format(format);
  },
};
export default date;
