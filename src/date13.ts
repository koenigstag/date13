export class Date13 {
  private base: Date;

  private year: number;
  private month: number; // 0-based
  private date: number;

  constructor(milis: number): Date13
  constructor(date: Date | Date13): Date13
  constructor(iso: string): Date13
  // constructor(year: number, month?: number, date: number, hour?: number, minute?: number, second?: number, milisecond?: number): Date13
  constructor(a?: Date | Date13 | string | number, b?: number, c?: number, d?: number, e?: number, f?: number) {
    if (a instanceof Date || a instanceof Date13) {
      this.base = Date13.fromDate(a);
    } else if (typeof a === 'string') {
      const d13 = Date13.fromISOString(a);
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

  static fromISOString(str: string): Date13 {
    if (typeof str != 'string') {
      throw TypeError('Argument must be a string');
    }

    if (/^\d{4}-13/i.test(str)) {
      return fromDate13ISOString(str);
    } else {
      return new Date13(Date.parse(str));
    }
  }

  static fromDate(date: Date | Date13): Date13 {
    if (typeof date != 'object' || !(date instanceof Date) || !(date instanceof Date13)) {
      throw new TypeError('Argument must be a Date type');
    }

    return Date13.fromMiliseconds(date.getTime());
  }

  static fromUnixMiliseconds(milis: number): Date13 {
    if (typeof milis != 'number') {
      throw new TypeError ('Argument must be a number');
    }

    const d13 = new Date13();

    d13.setBase(new Date(milis));

    return d13;
  }

  static fromUnixSeconds(sec: number): Date13 {
    if (typeof sec != 'number') {
      throw new TypeError ('Argument must be a number');
    }

    return Date13.fromUnixMiliseconds(sec * 1000);
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

  if (/^\d{4}-\d{2}-\d{2}/i.test(str)) {
    throw new Error('Not implemented');
  } else {
    throw new Error('Invalid ISO string');
  }
}