import { CalendarEngine } from './calendar-engine';
import constants from './constants';
import { DateAPI } from './date.api';
import { formatDate } from './utils/format';
import { DateParts } from './types';
import utils from './utils';

export class Date13 extends DateAPI {
  static readonly constants = constants;
  static readonly utils = utils;

  constructor();
  constructor(date: Date | Date13);
  constructor(milliseconds: number);
  constructor(dateString: string);
  constructor(
    year: number,
    monthIndex: number,
    date?: number,
    hour?: number,
    minute?: number,
    second?: number,
    millisecond?: number
  );
  constructor (
    a?: Date | Date13 | string | number,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number,
    g?: number
  ) {
    super(a, b, c, d, e, f, g);
  }

  protected UTC (
    year: number,
    monthIndex: number = 0,
    date: number = 1,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0
  ): number {
    const timestmap = CalendarEngine.Ordo13.fromDateParts({
      calendar: constants.date13CalendarName,
      year,
      month: monthIndex,
      date,
      hour,
      minute,
      second,
      millisecond,
    });

    return timestmap;
  }

  public static UTC (
    year: number,
    monthIndex?: number,
    date?: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number
  ): number {
    return new Date13().UTC(
      year,
      monthIndex,
      date,
      hours,
      minutes,
      seconds,
      milliseconds
    );
  }

  protected parse (str: string): number {
    if (typeof str != 'string') {
      throw new TypeError('Argument must be a string type');
    }

    if (constants.isoRegexp.test(str)) {
      const d13 = this.fromDate13ISOString(str);

      return d13.getTime();
    }

    return Date.parse(str);
  }

  public static parse(dateString: string): number {
    return new Date13().parse(dateString);
  }

  /* override super class */

  protected getDatePartsFromTimestamp (timestampMs: number): DateParts {
    return CalendarEngine.Ordo13.toDateParts(timestampMs);
  }

  protected getTimestampFromDateParts (
    dateParts: Partial<DateParts>
  ): number {
    return this.UTC(
      dateParts.year as number,
      dateParts.month,
      dateParts.date,
      dateParts.hour,
      dateParts.minute,
      dateParts.second,
      dateParts.millisecond
    );
  }

  /* string methods */

  /**
   * @description Returns the date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
   * @returns {string} Date13-ISO string
   */
  public toJSON (): string {
    return this.toISOString();
  }

  public toISOString (): string {
    return this.toDate13ISOString();
  }

  // TODO refactor formatting methods

  /**
   * @description Returns the date in string format (not ISO)
   * @returns {string} Date13 string representation
   */
  public toString (): string {
    return this.toGregorian().toString();
  }

  /**
   * @description Returns the date in string format (not ISO)
   * @returns {string} Date13 string representation
   */
  public toDateString (): string {
    return this.toGregorian().toDateString();
  }

  /**
   * @description Returns the date in string format (not ISO)
   * @returns {string} Date13 string representation
   */
  public toTimeString (): string {
    return this.toGregorian().toTimeString();
  }

  /**
   * @description Returns the date in string format (not ISO)
   * @returns {string} Date13 string representation
   */
  public toUTCString (): string {
    return this.toGregorian().toUTCString();
  }

  /**
   * @description Returns the date in string format using `Intl.DateTimeFormat`
   * @returns {string} Date13 string representation
   */
  public toLocaleDateString (locales?: any, options?: any): string {
    return this.toGregorian().toLocaleDateString(locales, options);
  }

  /**
   * @description Returns the date in string format using `Intl.DateTimeFormat`
   * @returns {string} Date13 string representation
   */
  public toLocaleTimeString (locales?: any, options?: any): string {
    return this.toGregorian().toLocaleTimeString(locales, options);
  }

  /**
   * @description Returns the date in string format using `Intl.DateTimeFormat`
   * @returns {string} Date13 string representation
   */
  public toLocaleString (locales?: any, options?: any): string {
    return this.toGregorian().toLocaleString(locales, options);
  }

  /* custom methods */

  /**
   * @description Returns the date in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
   * @returns {string} Date13-ISO string
   */
  public toDate13ISOString (): string {
    return Date13.toDate13ISOString(this);
  }

  /**
   * @description Returns the quarter of the year (1-4)
   * @returns {number} quarter of the year (1-4)
   */
  public getQuarter (): number {
    const utcMonth = this.getUTCMonth();

    return Math.floor(utcMonth / constants.monthsInYear13 / 4) + 1;
  }

  /**
   * @description Returns boolean value indicating if the year is a leap year
   * @returns {boolean} true if the year is a leap year, false otherwise
   */
  public get isLeapYear (): boolean {
    return utils.isLeapYear(this.getUTCFullYear());
  }

  /**
   * @description Returns UTC timestamp in milliseconds since 1970-01-01T00:00:00Z
   * @returns {number} timestamp in milliseconds
   */
  public getUTCTime (): number {
    return this.getTime();
  }

  /**
   * @description Returns local time in milliseconds since 1970-01-01T00:00:00Z
   * @returns {number} timestamp in milliseconds
   */
  public getLocalTime (): number {
    return super.getLocalTime();
  }

  /* conversion methods */

  /**
   * @description Convert Date13 instance to JS Date instance
   * @returns {Date} JS Date instance
   */
  public toGregorian (): Date {
    return Date13.toGregorian(this);
  }

  /**
   * @description Convert Date13 instance to JS Date instance
   * @param param Date13 instance (or Date or unix timestamp)
   * @returns {Date} JS Date instance
   */
  public static toGregorian (param: Date | Date13 | number): Date {
    if (typeof param === 'number') {
      return new Date(param);
    }

    return new Date(param.getTime());
  }

  /**
   * @description Convert JS Date instance to Date13 instance
   * @param {Date} date JS Date instance
   * @returns {Date13} Date instance
   */
  public static fromGregorian (date: Date | Date13): Date13 {
    return Date13.fromDate(date);
  }

  /**
   * @description Convert Date13 instance to ISO string
   * @param {string} str ISO string
   * @returns {Date13} Date13 instance
   */
  protected fromISOString (str: string): Date13 {
    if (typeof str != 'string') {
      throw TypeError('Argument must be a string');
    }

    return this.fromDate13ISOString(str);
  }

  /**
   * @description Convert Date13 ISO string to Date13 instance
   * @param {string} str Date13-ISO string
   * @returns {Date13} Date13 instance
   */
  protected fromDate13ISOString (str: string): Date13 {
    if (typeof str != 'string') {
      throw new TypeError('Argument must be a string');
    }

    // is string is not ISO format
    if (!constants.isoRegexp.test(str)) {
      const milis = Date13.parse(str);

      return new Date13(milis);
    }

    const isoString = str;

    const match =
      /^(\d{4})-(\d{1,2})-(\d{1,2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?(Z)?$/.exec(
        isoString
      );

    if (!match) throw new Error('Invalid Date13 ISO string');

    const [, yearStr, monthStr, dateStr, h, m, s, ms, z] = match;

    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1;
    const date = parseInt(dateStr);

    let hours = h !== undefined ? parseInt(h) : 0;
    let minutes = m !== undefined ? parseInt(m) : 0;
    let seconds = s !== undefined ? parseInt(s) : 0;
    let milliseconds =
      ms !== undefined ? parseInt(utils.pad(ms, 'end', 3, '0')) : 0;

    let milis = Date13.UTC(
      year,
      month - 1,
      date,
      hours,
      minutes,
      seconds,
      milliseconds
    );

    if (!z) {
      const d13 = new Date13();
      milis = d13.calculateLocalFromUTCTimestamp(milis, d13.getDefaultTimezoneOffset());
    }

    return new Date13(milis);
  }

  /**
   * @description Convert Date13 instance to ISO string
   * @param {Date13} date Date13 instance
   * @returns {string} Date13-ISO string
   */
  public static toDate13ISOString (date: Date13): string {
    if (!(date instanceof Date13)) {
      throw new TypeError('Argument must be a Date type');
    }

    return formatDate(date, constants.isoPattern);
  }

  /**
   * @description Convert Date-like instance to Date13 instance
   * @param {Date} date a Date-like object that should have getTime() method that returns a timestamp in milliseconds
   * @returns {Date13} Date13 instance
   */
  public static fromDate (date: Date | Date13): Date13 {
    if (typeof date !== 'object' || typeof date.getTime !== 'function') {
      throw new TypeError('Argument must be a Date type');
    }

    return Date13.fromUnixMilliseconds(date.getTime());
  }

  /**
   * @description Convert Unix milliseconds to Date13 instance
   * @param {number} milis Unix milliseconds
   * @returns {Date13} Date13 instance
   */
  public static fromUnixMilliseconds (milis: number): Date13 {
    if (typeof milis != 'number') {
      throw new TypeError('Argument must be a number');
    }

    if (isNaN(milis)) {
      throw new TypeError('Invalid date value');
    }

    return new Date13(milis);
  }

  /**
   * @description Convert Unix seconds to Date13 instance
   * @param {number} seconds Unix seconds
   * @returns {Date13} Date13 instance
   */
  public static fromUnixSeconds (seconds: number): Date13 {
    if (typeof seconds != 'number') {
      throw new TypeError('Argument must be a number');
    }

    if (isNaN(seconds)) {
      throw new TypeError('Invalid date value');
    }

    return Date13.fromUnixMilliseconds(seconds * 1000);
  }
}
