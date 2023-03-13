import {FormatFunction} from 'i18next';
import moment from 'moment';
import * as config from '../i18n/i18n';

export const calendarStrings = {
  lastDay: '[Yesterday at] LT',
  nextDay: '[Tomorrow at] LT',
  sameDay: '[Today at] LT',
  sameElse: 'MM/DD/YYYY LT',
};

moment.calendarFormat = function (myMoment, now) {
  var diff = myMoment.diff(now, 'days', true);
  return diff < -6
    ? 'sameElse'
    : diff < -1
    ? 'sameElse' // lastWeek
    : diff < 0
    ? 'lastDay'
    : diff < 1
    ? 'sameDay'
    : diff < 2
    ? 'nextDay'
    : diff < 7
    ? 'nextWeek'
    : 'sameElse';
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
          moment.locale(locale, {
            calendar: calendarStrings,
          });
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
