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

  private timestampMilis: number = NaN;

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
    this.timestampMilis = this.calculateTimestamp(a, b, c, d, e, f, g);
    this.onTimestampUpdate(this.timestampMilis, 'constructor');
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

  private onTimestampUpdate (timestampMilis: number, source: string) {
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

  private setBase (d: Date | Date13 | number) {
    this.timestampMilis = typeof d === 'number' ? d : d.getTime();
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
    const { year: localYear } = this.getLocalDateParts();

    return localYear;
  }

  public getUTCFullYear () {
    const { year: utcYear } = this.getUTCDateParts();

    return utcYear;
  }

  public getMonth () {
    const { month: localMonth } = this.getLocalDateParts();

    return localMonth;
  }

  public getUTCMonth () {
    const { month: utcMonth } = this.getUTCDateParts();

    return utcMonth;
  }

  public getDate () {
    const { date: localDate } = this.getLocalDateParts();

    return localDate;
  }

  public getUTCDate () {
    const { date: utcDate } = this.getUTCDateParts();

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

  public setTime (time: number) {
    const d = this.toGregorian();
    d.setTime(time);
    this.setBase(d);

    return this.getTime();
  }

  public setDate (date: number) {
    const d = this.toGregorian();
    d.setDate(date);
    this.setBase(d);

    return this.getTime();
  }

  public setUTCDate (date: number) {
    const d = this.toGregorian();
    d.setUTCDate(date);
    this.setBase(d);

    return this.getTime();
  }

  public setMonth (month: number) {
    const d = this.toGregorian();
    d.setMonth(month);
    this.setBase(d);

    return this.getTime();
  }

  public setUTCMonth (month: number) {
    const d = this.toGregorian();
    d.setUTCMonth(month);
    this.setBase(d);

    return this.getTime();
  }

  public setFullYear (year: number) {
    const d = this.toGregorian();
    d.setFullYear(year);
    this.setBase(d);

    return this.getTime();
  }

  public setUTCFullYear (year: number) {
    const d = this.toGregorian();
    d.setUTCFullYear(year);
    this.setBase(d);

    return this.getTime();
  }

  public setHours (hours: number, minutes?: number, seconds?: number, milis?: number) {
    const d = this.toGregorian();
    d.setHours(hours);

    if (typeof minutes === 'number')
      d.setMinutes(minutes);
    if (typeof seconds === 'number')
      d.setSeconds(seconds);
    if (typeof milis === 'number')
      d.setMilliseconds(milis);

    this.setBase(d);

    return this.getTime();
  }

  public setUTCHours (hour: number) {
    const d = this.toGregorian();
    d.setUTCHours(hour);
    this.setBase(d);

    return this.getTime();
  }

  public setMinutes (minute: number) {
    const d = this.toGregorian();
    d.setMinutes(minute);
    this.setBase(d);

    return this.getTime();
  }

  public setUTCMinutes (minute: number) {
    const d = this.toGregorian();
    d.setUTCMinutes(minute);
    this.setBase(d);

    return this.getTime();
  }

  public setSeconds (second: number) {
    const d = this.toGregorian();
    d.setSeconds(second);
    this.setBase(d);

    return this.getTime();
  }

  public setUTCSeconds (second: number) {
    const d = this.toGregorian();
    d.setUTCSeconds(second);
    this.setBase(d);

    return this.getTime();
  }

  public setMilliseconds (milisecond: number) {
    const d = this.toGregorian();
    d.setMilliseconds(milisecond);
    this.setBase(d);

    return this.getTime();
  }

  public setUTCMilliseconds (milisecond: number) {
    const d = this.toGregorian();
    d.setUTCMilliseconds(milisecond);
    this.setBase(d);

    return this.getTime();
  }

  /* system interface methods */

  public valueOf () {
    return this.getTime();
  }

  [Symbol.toPrimitive] (hint?: 'number' | 'string' | 'default') {
    return hint === 'number' ? this.valueOf() : this.toString();
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

  public toDateParts () {
    return this.getLocalDateParts()
  }

  // TODO refactor to String methods

  public toString () {
    return this.toGregorian().toString();
  }

  public toDateString () {
    return this.toGregorian().toDateString();
  }

  public toTimeString () {
    return this.toGregorian().toTimeString();
  }

  public toLocaleDateString (locales?: any, options?: any) {
    return this.toGregorian().toLocaleDateString(locales, options);
  }

  public toLocaleTimeString (locales?: any, options?: any) {
    return this.toGregorian().toLocaleTimeString(locales, options);
  }

  public toUTCString () {
    return this.toGregorian().toUTCString();
  }

  public toLocaleString (locales?: any, options?: any) {
    return this.toGregorian().toLocaleString(locales, options);
  }

  /* custom methods */

  public get isLeapYear () {
    return utils.isLeapYear(this.getUTCFullYear());
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
  static UTC(year: number, monthIndex?: number, date?: number, hour?: number, minute?: number, second?: number, millisecond?: number): number {
    return fromDate13Parts(year, monthIndex, date, hour, minute, second, millisecond);
  }

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

    // TODO fix
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

    const [, yearStr, monthStr, dateStr, h, m, s, ms, z] = match;

    const year = parseInt(yearStr);
    const month = parseInt(monthStr) - 1;
    const date = parseInt(dateStr);

    let hours = h !== undefined ? parseInt(h) : 0;
    let minutes = m !== undefined ? parseInt(m) : 0;
    let seconds = s !== undefined ? parseInt(s) : 0;
    let milliseconds =
      ms !== undefined ? parseInt(utils.pad(ms, 'end', 3, '0')) : 0;

    let milis = Date13.UTC(year, month, date, hours, minutes, seconds, milliseconds);

    if (!z) {
      const timezoneOffset = new Date().getTimezoneOffset();
      milis -= timezoneOffset * 60 * 1000;
    }

    return new Date13(milis);
  }

  static toDate13ISOString (date: Date13): string {
    if (!(date instanceof Date13)) {
      throw new TypeError('Argument must be a Date type');
    }

    let transformedPattern = String(constants.isoPattern);

    // TODO remove as any when Date13 will satisfy Date interface
    const replacers = getReplacersFromDate(date);

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
