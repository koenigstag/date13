import constants from './constants';
import {
  fromDate13Parts,
  date13PartsFromMilis,
  toGregorianDate,
} from './convert';
import { getReplacersFromDate } from './format';
import { DateParts } from './types';
import utils from './utils';

export class Date13 {
  static readonly constants = constants;
  static readonly utils = utils;

  private timestampMilis: number;

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
    milisecond?: number
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
    const milis = this.calculateTimestamp(a, b, c, d, e, f, g);

    this.updateTimestamp(milis, 'constructor');
  }

  private calculateTimestamp (
    a?: Date | Date13 | string | number,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number,
    g?: number
  ): number {
    if (a instanceof Date || a instanceof Date13) {
      return a.getTime();
    } else if (typeof a === 'string') {
      const milis = Date13.parse(a);
      return milis;
    } else if (typeof a === 'number') {
      if (a && b) {
        const d13 = Date13.fromDateParts(a, b, c, d, e, f, g);
        return d13.getTime();
      } else {
        return a;
      }
    } else {
      return Date13.now();
    }
  }

  private updateTimestamp (timestampMilis: number, source: string) {
    this.timestampMilis = timestampMilis;

    // const {
    //  year: utcYear,
    //  month: utcMonthIndex,
    //  date: utcDate,
    //  hour: utcHour,
    //  minute: utcMinute,
    //  second: utcSecond,
    //  milisecond: utcMilisecond,
    //  timezoneOffset,
    //} = date13PartsFromMilis(timestampMilis);

    // console.log('updateFromBase', {
    //   source,
    //   utcYear,
    //   utcMonthIndex,
    //   utcDate,
    // });
  }

  /* JS Date interface */

  /* getter methods */

  public getTime () {
    return this.timestampMilis;
  }

  public getUTCDay () {
    return this.toGregorian().getUTCDay();
  }

  public getDay () {
    return this.toGregorian().getDay();
  }

  public getQuarter () {
    const utcMonth = this.getUTCMonth();

    return (
      Math.floor(utcMonth / constants.monthsInYear13 / 4) + 1
    );
  }

  public getFullYear () {
    const { year: localYear } = getLocalDateParts();

    return localYear;
  }

  public getUTCFullYear () {
    const { year: utcYear } = getUTCDateParts();

    return utcYear;
  }

  public getMonth () {
    const { month: localMonth } = getLocalDateParts();

    return localMonth;
  }

  public getUTCMonth () {
    const { month: utcMonth } = getUTCDateParts();

    return utcMonth;
  }

  public getDate () {
    const { date: localDate } = getLocalDateParts();

    return localDate;
  }

  public getUTCDate () {
    const { date: utcDate } = getUTCDateParts();

    return utcDate;
  }

  public getHours () {
    return this.toGregorian().getHours();
  }

  public getUTCHours () {
    return this.toGregorian().getUTCHours();
  }

  public getMinutes () {
    return this.toGregorian().getMinutes();
  }

  public getUTCMinutes () {
    return this.toGregorian().getUTCMinutes();
  }

  public getSeconds () {
    return this.toGregorian().getSeconds();
  }

  public getUTCSeconds () {
    return this.toGregorian().getUTCSeconds();
  }

  public getMilliseconds () {
    return this.toGregorian().getMilliseconds();
  }

  public getUTCMilliseconds () {
    return this.toGregorian().getUTCMilliseconds();
  }

  public getTimezoneOffset () {
    return this.toGregorian().getTimezoneOffset();
  }

  /* setter methods */

  public setDate (date: number) {
    const d = this.toGregorian();
    d.setDate(date);
    this.setBase(d);
  }

  public setUTCDate (date: number) {
    const d = this.toGregorian();
    d.setUTCDate(date);
    this.setBase(d);
  }

  public setMonth (month: number) {
    const d = this.toGregorian();
    d.setMonth(month);
    this.setBase(d);
  }

  public setUTCMonth (month: number) {
    const d = this.toGregorian();
    d.setUTCMonth(month);
    this.setBase(d);
  }

  public setFullYear (year: number) {
    const d = this.toGregorian();
    d.setFullYear(year);
    this.setBase(d);
  }

  public setUTCFullYear (year: number) {
    const d = this.toGregorian();
    d.setUTCFullYear(year);
    this.setBase(d);
  }

  public setHours (hour: number) {
    const d = this.toGregorian();
    d.setHours(hour);
    this.setBase(d);
  }

  public setUTCHours (hour: number) {
    const d = this.toGregorian();
    d.setUTCHours(hour);
    this.setBase(d);
  }

  public setMinutes (minute: number) {
    const d = this.toGregorian();
    d.setMinutes(minute);
    this.setBase(d);
  }

  public setUTCMinutes (minute: number) {
    const d = this.toGregorian();
    d.setUTCMinutes(minute);
    this.setBase(d);
  }

  public setSeconds (second: number) {
    const d = this.toGregorian();
    d.setSeconds(second);
    this.setBase(d);
  }

  public setUTCSeconds (second: number) {
    const d = this.toGregorian();
    d.setUTCSeconds(second);
    this.setBase(d);
  }

  public setMilliseconds (milisecond: number) {
    const d = this.toGregorian();
    d.setMilliseconds(milisecond);
    this.setBase(d);
  }

  public setUTCMilliseconds (milisecond: number) {
    const d = this.toGregorian();
    d.setUTCMilliseconds(milisecond);
    this.setBase(d);
  }

  public setTime (time: number) {
    const d = this.toGregorian();
    d.setTime(time);
    this.setBase(d);
  }

  /* system interface methods */

  public valueOf () {
    return this.getTime();
  }

  public toString () {
    return this.toGregorian().toString();
  }

  /* formatting methods */

  public toISOString () {
    return this.toDate13ISOString();
  }

  public toDate13ISOString () {
    return Date13.toDate13ISOString(this);
  }

  public toJSON () {
    return this.toISOString();
  }

  /* custom methods */

  public get isLeapYear () {
    return utils.isLeapYear(this.utcYear);
  }

  public getUTCTime () {
    return this.getTime();
  }

  private getLocalTime () {
    return this.getUTCTime() - this.getTimezoneOffsetInMilliseconds();
  }

  public getUTCWeekDay () {
    return this.getUTCDay();
  }

  public getWeekDay () {
    return this.getDay();
  }

  public getTimezoneOffsetInMilliseconds () {
    return this.toGregorian().getTimezoneOffset() * 60 * 1000;
  }

  public getUTCDateParts (): DateParts {
    const timestamp = this.getTime();
    return date13PartsFromMilis(timestamp);
  }

  public getLocalDateParts (): DateParts {
    const localTimestamp = this.getLocalTime();
    return date13PartsFromMilis(localTimestamp);
  }

  /* conversion methods */

  public toGregorian (): Date {
    return Date13.toGregorian(this);
  }

  static toGregorian (param: Date | Date13 | number): Date {
    return toGregorianDate(param);
  }

  static fromGregorian (date: Date): Date13 {
    return Date13.fromDate(date);
  }

  // TODO implement
  // static UTC(year: number, month?: number, date?: number, hour?: number, minute?: number, second?: number, milisecond?: number): number {
  //   throw new Error('Not implemented');
  // }

  static now () {
    return Date.now();
  }

  static parse (str: string): number {
    if (typeof str != 'string') {
      throw new TypeError('Argument must be a string type');
    }

    if (constants.isoRegexp.test(str)) {
      const d13 = this.fromDate13ISOString(str);

      return d13.getTime();
    }

    return Date.parse(str);
  }

  static fromISOString (str: string): Date13 {
    if (typeof str != 'string') {
      throw TypeError('Argument must be a string');
    }

    return this.fromDate13ISOString(str);
  }

  static fromDate13ISOString (str: string): Date13 {
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

    const [, yearStr, monthStr, dayStr, h, m, s, ms, z] = match;

    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1;
    const day = parseInt(dayStr);

    let hours = h !== undefined ? parseInt(h) : 0;
    let minutes = m !== undefined ? parseInt(m) : 0;
    let seconds = s !== undefined ? parseInt(s) : 0;
    let milliseconds =
      ms !== undefined ? parseInt(utils.pad(ms, 'end', 3, '0')) : 0;

    // TODO rewrite to Date13.UTC or milisFromDate13Parts

    throw new Error('Not implemented');
  }

  static toDate13ISOString (date: Date13): string {
    if (!(date instanceof Date13)) {
      throw new TypeError('Argument must be a Date type');
    }

    let transformedPattern = String(constants.isoPattern);

    // TODO remove as any when Date13 will satisfy Date interface
    const replacers = getReplacersFromDate(date as any);

    for (const [key, val] of Object.entries(replacers)) {
      transformedPattern = transformedPattern.replace(
        new RegExp(key, 'g'),
        String(val.bind(replacers)())
      );
    }

    return transformedPattern;
  }

  static fromDate (date: Date | Date13): Date13 {
    if (!(date instanceof Date) && !(date instanceof Date13)) {
      throw new TypeError('Argument must be a Date type');
    }

    return Date13.fromUnixMilliseconds(date.getTime());
  }

  static fromDateParts (
    a: number,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number,
    g?: number
  ): Date13 {
    if (typeof a != 'number') {
      throw new TypeError('Argument 1 must be a number');
    }

    if (isNaN(a)) {
      throw new TypeError('Argument 1 must be not NaN');
    }

    if (typeof b === 'number') {
      if (isNaN(b)) {
        throw new TypeError('Argument 2 must be not NaN');
      }
    }

    if (typeof c === 'number') {
      if (isNaN(c)) {
        throw new TypeError('Argument 3 must be not NaN');
      }
    }

    const parts = [a, b, c, d, e, f, g].filter(
      part => typeof part === 'number'
    ) as [number, number, number, number?, number?, number?, number?];

    // year, month and date
    if (parts.length > 1) {
      const milis = fromDate13Parts(...parts);

      return Date13.fromUnixMilliseconds(milis);
    } else {
      // milis
      return Date13.fromUnixMilliseconds(parts[0]);
    }
  }

  static fromUnixMilliseconds (milis: number): Date13 {
    if (typeof milis != 'number') {
      throw new TypeError('Argument must be a number');
    }

    if (isNaN(milis)) {
      throw new TypeError('Invalid date value');
    }

    return new Date13(milis);
  }

  static fromUnixSeconds (seconds: number): Date13 {
    if (typeof seconds != 'number') {
      throw new TypeError('Argument must be a number');
    }

    if (isNaN(seconds)) {
      throw new TypeError('Invalid date value');
    }

    return Date13.fromUnixMilliseconds(seconds * 1000);
  }
}
