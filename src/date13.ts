export class Date13 {
  private base: Date;

  private year: number;
  private month: number; // 0-based
  private date: number;

  constructor(unixMilis: number): Date13
  constructor(date: Date | Date13): Date13
  constructor(iso: string): Date13
  constructor(year: number, month: number, date: number, hour?: number, minute?: number, second?: number, milisecond?: number): Date13
  constructor(a?: Date | Date13 | string | number, b?: number, c?: number, d?: number, e?: number, f?: number, g?: number) {
    if (a instanceof Date || a instanceof Date13) {
      this.base = Date13.fromDate(a);
    } else if (typeof a === 'string') {
      this.base = Date13.parse(a);
    } else if (typeof a === 'number') {
      const d13 = Date13.fromNumbers(a, b, c, d, e, f, g);
      this.base = d13.toGregorian();
    } else {
      this.base = new Date();
    }

    this.updateFromBase();
  }

  private updateFromBase() {
    const { year, month, date } = fromGregorian(this.base);

    this.year = year;
    this.month = month;
    this.date = date;
  }

  public getUTCFullYear() {
    this.year;
  }

  public getUTCMonth() {
    this.month;
  }

  public getUTCDate() {
    this.date;
  }

  public getDay() {
    this.base.getDay();
  }

  public getQuarter() {
    return Math.floor(this.month / 3.25) + 1;
  }

  public getTime() {
    this.base.getTime();
  }

  public valueOf() {
    this.getTime();
  }

  public toString() {
    this.base.toString();
  }

  public toISOString() {
    this.base.toISOString();
  }

  public toJSON() {
    this.toISOString();
  }

  public setBase(date: Date | Date13) {
    this.base = new Date(date.getTime());
    this.updateFromBase();
  }

  public toGregorian(): Date {
    return new Date(this.getTime());
  }

  static parse(str: string): number {
    if (typeof str != 'string') {
      throw new TypeError('Argument must be a string type');
    }

    if (/^\d{4}-13-/i.test(str)) {
      const d13 = fromDate13ISOString(str);

      return d13.getTime();
    }

    return Date.parse(str);
  }

  static fromISOString(str: string): Date13 {
    if (typeof str != 'string') {
      throw TypeError('Argument must be a string');
    }

    if (/^\d{4}-13-/i.test(str)) {
      return fromDate13ISOString(str);
    } else {
      return new Date13(Date.parse(str));
    }
  }

  static fromDate(date: Date | Date13): Date13 {
    if (typeof date != 'object' || !(date instanceof Date) || !(date instanceof Date13)) {
      throw new TypeError('Argument must be a Date type');
    }

    return Date13.fromUnixMiliseconds(date.getTime());
  }

  static fromNumbers(a: number, b?: number, c?: number, d?: number, e?: number, f?: number, g?: number): Date13 {
    if (typeof a != 'number') {
      throw new TypeError('Argument 1 must be a number');
    }

    if (isNaN(a)) {
      throw new TypeError('Argument 1 must be not NaN');
    }

    if (typeof b === 'number')
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
      return Date13.fromUnixMiliseconds(a);
    }
  }

  static fromUnixMiliseconds(milis: number): Date13 {
    if (typeof milis != 'number') {
      throw new TypeError ('Argument must be a number');
    }

    if (isNaN(milis)) {
      throw new TypeError('Argument must be not NaN');
    }

    const d13 = new Date13();

    d13.setBase(new Date(milis));

    return d13;
  }

  static fromUnixSeconds(seconds: number): Date13 {
    if (typeof sec != 'number') {
      throw new TypeError ('Argument must be a number');
    }

    if (isNaN(seconds)) {
      throw new TypeError('Argument must be not NaN');
    }

    return Date13.fromUnixMiliseconds(seconds * 1000);
  }
}

function fromGregorian (date: Date): { year: number, month: number, date: number} {
  // TODO implement
  throw new Error('Not implemented');
}

function fromDate13ISOString(str: string): Date13 {
  if (typeof str != 'string') {
    throw new TypeError('Argument must be a string');
  }

  const d13Regexp = /^\d{4}-\d{2}-\d{2}/i;

  if (d13Regexp.test(str)) {
    throw new Error('Not implemented');
  } else {
    throw new Error('Invalid ISO string');
  }
}

function toDate13ISOString(date: Date13) {
  if (!(date instanceof Date13)) {
    throw new TypeError('Argument must be a Date type');
  }

  throw new Error('Not implemented');
}
