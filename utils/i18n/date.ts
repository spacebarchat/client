import { FormatFunction } from "i18next";
import moment from "moment";
import * as config from "../i18n/i18n";

export const calendarStrings = {
  lastDay: "[Yesterday at] LT",
  sameDay: "[Today at] LT",
  sameElse: "MM/DD/YYYY LT",
};

const date: {
  init(locale: string): Promise<void>;
  format: FormatFunction;
} = {
  init(locale) {
    return new Promise((resolve, reject) => {
      resolve();
      config
        .tryImportMomentLocale(locale)
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
