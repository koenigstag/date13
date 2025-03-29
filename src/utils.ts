import constants from './constants';

const utils = {
  isNil (value: any): value is null | undefined {
    return value === null || value === undefined;
  },
  objCloneDeep<T> (obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.objCloneDeep(item)) as unknown as T;
    }

    const clonedObj: Record<string, unknown> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = this.objCloneDeep((obj as Record<string, unknown>)[key]);
      }
    }

    return clonedObj as T;
  },
  wrapTextWithRtl(text: string): string {
    return `\u202B${text}\u202C`; // wrap with RLE … PDF
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
  getDaysSinceEpoch (date: Date): number {
    const epoch = Date.UTC(constants.unixEpochYear, 0, 1);

    const utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );

    return Math.floor((utc - epoch) / constants.milisecondsPerDay);
  },
  isLeapYear (year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  },
  getDaysInYear (year: number) {
    return this.isLeapYear(year) ? 366 : 365;
  },
  getMonths (year: number) {
    return Array(12)
      .fill(constants.daysInMonthAverage)
      .concat(
        utils.isLeapYear(year)
          ? constants.daysInLastMonthLeapYear
          : constants.daysInLastMonthNormalYear
      );
  },
  getDaysInMonth (year: number, month: number) {
    const months = this.getMonths(year);
    return months[month];
  },
  get12HourFormat (date: Date) {
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const period = hours24 < 12 ? 'AM' : 'PM';
    return { hours12, period };
  },
  pad (input: any, dir: 'start' | 'end', len: number, char: string = '0') {
    const text = String(input);

    if (text.length >= len) {
      return text;
    }

    // if padStart and padEnd are supported
    // @ts-ignore
    if (typeof text.padStart === 'function') {
      return dir === 'start' ? text.padStart(len, char) : text.padEnd(len, char);
    } else {
      // polyfill for padStart and padEnd

      const padLen = len - text.length;
      if (padLen <= 0) {
        return text;
      }

      const padStr = Array(padLen).join(char);
      return dir === 'start' ? padStr + text : text + padStr;
    }
  }
};

export default utils;
