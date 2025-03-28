import { getMonthNamesEn, isLeapYear } from './utils';

export const constants = {
  monthsInYear: () => 13,
  daysInMonthAverage: () => 28,
  getDaysInYear: (year: number) => (isLeapYear(year) ? 366 : 365),
  months: (year: number) =>
    Array(12)
      .fill(28)
      .concat(isLeapYear(year) ? 30 : 29),
  daysInMonth (year: number, month: number) {
    const months = this.months(year);
    return months[month];
  },
  month13NameEn: (short?: boolean) => (short ? 'Lun' : 'Lunary'),
  monthNamesEn (short?: boolean) {
    const names = [
      ...(short ? monthShortNamesEn : monthNamesEn),
      this.month13NameEn(short),
    ];
    return names;
  },
  unixEpochYear: () => 1970,
  isoRegexp: () => /^\d{4}-\d{1,2}-\d{1,2}/i,
  month13IsoRegexp: () => /^\d{4}-13-/i,
};

export const monthNamesEn = getMonthNamesEn(false);
export const monthShortNamesEn = getMonthNamesEn(true);
