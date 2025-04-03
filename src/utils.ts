import constants from './constants';
import type {
  CalendarType,
  Date13MonthLengthArray,
  GregorianMonthLengthArray,
  MonthLengthArrayType,
} from './types';

const jsPolyfills = {
  isNil (value: any): value is null | undefined {
    return value === null || value === undefined;
  },
  pad (input: any, dir: 'start' | 'end', len: number, char: string = '0') {
    const text = String(input);

    if (text.length >= len) {
      return text;
    }

    // if padStart and padEnd are supported
    // @ts-ignore
    if (typeof text.padStart === 'function') {
      return dir === 'start'
        ? text.padStart(len, char)
        : text.padEnd(len, char);
    } else {
      // polyfill for padStart and padEnd

      const padLen = len - text.length;
      if (padLen <= 0) {
        return text;
      }

      const padStr = Array(padLen).join(char);
      return dir === 'start' ? padStr + text : text + padStr;
    }
  },
  arrayAt<T> (arr: T[], index: number): T | undefined {
    const len = arr.length;

    // negative index case
    if (index < 0) {
      index = len + index;
    }

    // out of bounds case
    if (index < 0 || index >= len) {
      return undefined;
    }

    return arr[index];
  },
  objCloneDeep<T> (obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.objCloneDeep(item)) as unknown as T;
    }

    const clonedObj: Record<string, unknown> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = this.objCloneDeep(
          (obj as Record<string, unknown>)[key]
        );
      }
    }

    return clonedObj as T;
  },
  wrapTextWithRtl (text: string): string {
    return `\u202B${text}\u202C`; // wrap with RLE … PDF
  },
};

const dateUtils = {
  isValidDate (value: unknown): value is Date {
    return value instanceof Date && !isNaN(value.getTime());
  },
  isLeapYear (year: number): boolean {
    return this.isLeapYearAsimov(year);
  },
  isLeapYearAsimov (year: number): boolean {
    if (year % 4 !== 0) return false;
    if (year % 100 === 0 && year % 400 !== 0) return false;
    // Asimov's rule
    if (year % 3200 === 0 && year % 12800 !== 0) return false;

    return true;
  },
  getTotalDaysInYear (year: number): 365 | 366 {
    return this.isLeapYear(year)
      ? constants.daysInLeapYear
      : constants.daysInNormalYear;
  },
  timeToMilis (
    utcHour?: number,
    utcMinute?: number,
    second?: number,
    milisecond?: number
  ): number {
    let miliseconds = 0;

    if (!utcHour && !utcMinute && !second) {
      return miliseconds;
    }

    const hourInMilis = utcHour ? utcHour * 60 * 60 * 1000 : 0;
    const minuteInMilis = utcMinute ? utcMinute * 60 * 1000 : 0;
    const secondInMilis = second ? second * 1000 : 0;
    const milisecondInMilis = milisecond ? milisecond : 0;

    miliseconds +=
      hourInMilis + minuteInMilis + secondInMilis + milisecondInMilis;

    return miliseconds;
  },
  getMonthsInYear (type: CalendarType): 13 | 12 {
    if (type === 'ordo13') {
      return constants.monthsInYear13;
    }

    return constants.monthsInYearGregorian;
  },
  getMonthLengths<T extends CalendarType> (
    year: number,
    type: T
  ): MonthLengthArrayType<T> {
    if (type === 'ordo13') {
      return this.getDate13MonthLengths(year) as MonthLengthArrayType<T>;
    }

    return this.getGregorianMonthLengths(year) as MonthLengthArrayType<T>;
  },
  getDate13MonthLengths (year: number): Date13MonthLengthArray {
    return [
      28, // January
      28,
      28,
      28,

      28,
      28,
      28,
      28,

      28,
      28,
      28,
      28, // December

      this.getMonth13Length(year),
    ] as const;
  },
  getGregorianMonthLengths (year: number): GregorianMonthLengthArray {
    return [
      31, // January
      this.isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31, // December
    ] as const;
  },
  getMonth13Length (year: number): 29 | 30 {
    return this.isLeapYear(year)
      ? constants.daysInLastMonthLeapYear
      : constants.daysInLastMonthNormalYear;
  },
  getDaysInMonth (
    year: number,
    month: number,
    type: CalendarType
  ): (28 | 29 | 30) | (28 | 29 | 30 | 31) {
    const months = this.getMonthLengths(year, type);
    return months[month];
  },
  get12HourFormat (hours: number) {
    const hours24 = hours;
    const hours12 = hours24 % 12 || 12;
    const period = hours24 < 12 ? 'AM' : 'PM';
    return { hours12, period };
  },
  calculateMonthNames (
    locale: string,
    format?: Intl.DateTimeFormatOptions['month'],
    isGenitive?: boolean
  ): string[] {
    const formatter = new Intl.DateTimeFormat(locale, {
      month: format,
      timeZone: 'UTC',
    });

    const names: string[] = [];

    for (let month = 0; month < 12; month++) {
      const date = new Date(Date.UTC(constants.unixEpochYear, month, 1));
      names.push(formatter.format(date));
    }

    return names;
  },
};

const utils = {
  ...jsPolyfills,
  ...dateUtils,
};

export default utils;
