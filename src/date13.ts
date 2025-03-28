import { constants } from './constants';
import { convertToDate13 } from './convert';
import { fromDate13ISOString, toDate13ISOString } from './format';

export class Date13 {
  static readonly constants = constants;

  private base: Date;

  private utcYear: number;
  private utcMonth: number; // 0-based
  private utcDate: number;

  constructor();
  constructor(date: Date | Date13);
  constructor(milliseconds: number);
  constructor(dateString: string);
  constructor(year: number, month: number, date: number, hour?: number, minute?: number, second?: number, milisecond?: number);
  constructor(a?: Date | Date13 | string | number, b?: number, c?: number, d?: number, e?: number, f?: number, g?: number) {
    if (a instanceof Date || a instanceof Date13) {
      this.base = Date13.fromDate(a).toGregorian();
    } else if (typeof a === 'string') {
      const milis = Date13.parse(a);
      this.base = new Date(milis);
    } else if (typeof a === 'number') {
      this.base = Date13.fromDateParts(a, b, c, d, e, f, g).toGregorian();
    } else {
      this.base = new Date();
    }

    this.updateFromBase();
  }

  private updateFromBase () {
    const { year, month, date } = convertToDate13(this.base);

    this.utcYear = year;
    this.utcMonth = month;
    this.utcDate = date;
  }

  public setBase (date: Date | Date13) {
    this.base = new Date(date.getTime());
    this.updateFromBase();
  }

  /* js Date interface */

  /* getter methods */

  /* 0-6 */
  public getDay () {
    return this.base.getDay();
  }

  public getQuarter () {
    return Math.floor(this.utcMonth / constants.monthsInYear() / 4) + 1;
  }

  public getFullYear () {
    return this.getUTCFullYear();
  }

  public getUTCFullYear () {
    return this.utcYear;
  }

  /* 0-12 */
  public getMonth () {
    return this.getUTCMonth();
  }

  /* 0-12 */
  public getUTCMonth () {
    return this.utcMonth;
  }

  public getDate () {
    return this.getUTCDate();
  }

  public getUTCDate () {
    return this.utcDate;
  }

  public getHours () {
    return this.base.getHours();
  }

  public getUTCHours () {
    return this.base.getUTCHours();
  }

  public getMinutes () {
    return this.base.getMinutes();
  }

  public getUTCMinutes () {
    return this.base.getUTCMinutes();
  }

  public getSeconds () {
    return this.base.getSeconds();
  }

  public getUTCSeconds () {
    return this.base.getUTCSeconds();
  }

  public getMilliseconds () {
    return this.base.getMilliseconds();
  }

  public getUTCMilliseconds () {
    return this.base.getUTCMilliseconds();
  }

  public getTimezoneOffset () {
    return this.base.getTimezoneOffset();
  }

  /* compare methods */

  public getTime () {
    return this.base.getTime();
  }

  public valueOf () {
    return this.getTime();
  }

  /* formatting methods */

  public toString () {
    return this.base.toString();
  }

  public toISOString () {
    return this.base.toISOString();
  }

  public toJSON () {
    return this.toISOString();
  }

  /* conversion methods */

  public toGregorian (): Date {
    return Date13.toGregorian(this);
  }

  static toGregorian (date13: Date13): Date {
    return new Date(date13.getTime());
  }

  static fromGregorian (date: Date): Date13 {
    return Date13.fromDate(date);
  }

  // static UTC(year: number, month?: number, date?: number, hour?: number, minute?: number, second?: number, milisecond?: number): Date13 {
  //   throw new Error('Not implemented');
  //   // return new Date13(year, month, date, hour, minute, second, milisecond);
  // }

  static now () {
    return Date.now();
  }

  static parse (str: string): number {
    if (typeof str != 'string') {
      throw new TypeError('Argument must be a string type');
    }

    if (constants.month13IsoRegexp().test(str)) {
      const d13 = fromDate13ISOString(str);

      return d13.getTime();
    }

    return Date.parse(str);
  }

  static fromISOString (str: string): Date13 {
    if (typeof str != 'string') {
      throw TypeError('Argument must be a string');
    }

    if (constants.month13IsoRegexp().test(str)) {
      return fromDate13ISOString(str);
    } else {
      return new Date13(Date.parse(str));
    }
  }

  static fromDate13ISOString (str: string): Date13 {
    if (typeof str != 'string') {
      throw new TypeError('Argument must be a string');
    }

    return fromDate13ISOString(str);
  }

  static toDate13ISOString (date: Date13): string {
    if (!(date instanceof Date13)) {
      throw new TypeError('Argument must be a Date type');
    }

    return toDate13ISOString(date);
  }

  static fromDate (date: Date | Date13): Date13 {
    if (
      typeof date != 'object' ||
      !(date instanceof Date) ||
      !(date instanceof Date13)
    ) {
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

    if (b && c) {
      // year, month and date
      const date = new Date(a, b, c, d, e, f, g);
      return Date13.fromDate(date);
    } else {
      // milis
      return Date13.fromUnixMilliseconds(a);
    }
  }

  static fromUnixMilliseconds (milis: number): Date13 {
    if (typeof milis != 'number') {
      throw new TypeError('Argument must be a number');
    }

    if (isNaN(milis)) {
      throw new TypeError('Argument must be not NaN');
    }

    const d13 = new Date13();

    d13.setBase(new Date(milis));

    return d13;
  }

  static fromUnixSeconds (seconds: number): Date13 {
    if (typeof seconds != 'number') {
      throw new TypeError('Argument must be a number');
    }

    if (isNaN(seconds)) {
      throw new TypeError('Argument must be not NaN');
    }

    return Date13.fromUnixMilliseconds(seconds * 1000);
  }
}
