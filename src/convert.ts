import { constants } from './constants';
import { getDaysSinceEpoch } from './utils';

export type DateParts = {
  year: number;
  month: number; // 0-based
  date: number;
  hour: number;
  minute: number;
  second: number;
  milisecond: number;
};

export function convertToDate13 (input: Date): DateParts {
  const daysSinceEpoch = getDaysSinceEpoch(input);

  let year = constants.unixEpochYear();
  let dayOfYear = daysSinceEpoch;

  while (true) {
    const daysInYear = constants.getDaysInYear(year);
    if (dayOfYear < daysInYear) break;
    dayOfYear -= daysInYear;
    year++;
  }

  const months = constants.months(year);

  let month = 0;
  while (dayOfYear >= months[month]) {
    dayOfYear -= months[month];
    month++;
  }

  const date = dayOfYear + 1;

  const hour = input.getUTCHours();
  const minute = input.getUTCMinutes();
  const second = input.getUTCSeconds();
  const milisecond = input.getUTCMilliseconds();

  return {
    year,
    month,
    date,
    hour,
    minute,
    second,
    milisecond,
  };
}
