const constants = {
  monthsInYear: () => 13,
  daysInMonthAverage: () => 28,
  months: (year: number) => Array(12).fill(28).concat(isLeapYear(year) ? 30 : 29),
  daysInMonth: (year: number, month: number) => {
    const months = this.months(year);
    return months[month];
  },
  month13NameEn: (short?: boolean) => 'Lunary'.slice(0, short ? 3 : undefined),
  monthNamesEn: (short?: boolean) => {
    const names = [...(short ? monthShortNamesEn : monthNamesEn), this.month13NameEn(short)];
    return names;
  },
  unixEpochYear: () => 1970,
  isoRegexp: () => /^\d{4}-\d{1,2}-\d{1,2}/i,
  month13IsoRegexp: () => /^\d{4}-13-/i,
};

export class Date13 {
  static readonly constants = constants;

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

  // range 0-12 
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

  public getHours() {
    return this.base.getHours();
  }

  public getMinutes() {
    return this.base.getMinutes();
  }

  public getSeconds() {
    return this.base.getSeconds();
  }

  public getMiliseconds() {
    return this.base.getMiliseconds();
  }

  public getUTCHours() {
    return this.base.getUTCHours();
  }

  public getUTCMinutes() {
    return this.base.getUTCMinutes();
  }

  public getUTCSeconds() {
    return this.base.getUTCSeconds();
  }

  public getUTCMiliseconds() {
    return this.base.getUTCMiliseconds();
  }

  public getTimezoneOffset() {
    return this.base.getTimezoneOffset();
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

  static fromGregorian(date: Date | Date13): Date13 {
    return Date13.fromDate(date);
  }

  static parse(str: string): number {
    if (typeof str != 'string') {
      throw new TypeError('Argument must be a string type');
    }

    if (constants.month13IsoRegexp().test(str)) {
      const d13 = fromDate13ISOString(str);

      return d13.getTime();
    }

    return Date.parse(str);
  }

  static fromISOString(str: string): Date13 {
    if (typeof str != 'string') {
      throw TypeError('Argument must be a string');
    }

    if (constants.month13IsoRegexp().test(str)) {
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

const isoPattern = `{utcfullyear}-{utcmonth_pad2}-{utcdate_pad2}T{utchour_pad2}-{utcminute_pad2}-{utcsecond_pad2}.{utcmilis_pad3}Z`;

function getReplacersFromDate(date: Date13 | Date) {
  const padStart_2_0 = (val: any) => String(val).padStart(2, '0');
  const padEnd_3_0 = (val: any) => String(val).padEnd(3, '0');

  const replacers = {
    utcfullyear: () => date.getUTCFullYear(),
    utcmonth: () => date.getUTCMonth() + 1,
    utcmonth_pad2: () => padStart_2_0(this.month()),
    utcdate: () => date.getUTCDate(),
    utcdate_pad2: () => padStart_2_0(this.date()),
    utchour: () => date.getUTCHours(),
    utchour_pad2: () => padStart_2_0(this.hour())
    utcminute: () => date.getUTCMinutes(),
    utcminute_pad2: () => padStart_2_0(this.minute()),
    utcsecond: () => date.getUTCSeconds(),
    utcsecond_pad2: () => padStart_2_0(this.second()),
    utcmilis: () => date.getUTCMiliseconds(),
    utcmilis_pad3: () => padEnd_3_0(this.milis()),
  };

  return replacers;
}

function toDate13ISOString(date: Date13 | Date) {
  if (!(date instanceof Date13)) {
    throw new TypeError('Argument must be a Date type');
  }

  let transformedPattern = isoPattern;

  const replacers = getReplacersFromDate(date);

  for (const [key, val] of Object.entries(replacers)) {
    transformedPattern = transformedPattern.replace(new RegExp(`{${key}}`, 'gi'), val());
  }

  return transformedPattern;
}

function fromDate13ISOString(str: string): Date13 {
  if (typeof str != 'string') {
    throw new TypeError('Argument must be a string');
  }

  if (!constants.isoRegexp().test(str)) {
    return new Date13(Date.parse(str));
  }

  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?(Z)?$/.exec(iso);

  if (!match) throw new Error("Invalid Date13 ISO string");

  const [, yearStr, monthStr, dayStr, h, m, s, ms, z] = match;

  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1;
  const day = parseInt(dayStr);

  let hours = h !== undefined ? parseInt(h) : 0;
  let minutes = m !== undefined ? parseInt(m) : 0;
  let seconds = s !== undefined ? parseInt(s) : 0;
  let milliseconds = ms !== undefined ? parseInt(ms.padEnd(3, "0")) : 0;

  if (!z) {
    const local = new Date(year, month, day, hours, minutes, seconds, milliseconds);
    hours = local.getUTCHours();
    minutes = local.getUTCMinutes();
    seconds = local.getUTCSeconds();
    milliseconds = local.getUTCMilliseconds();
  }

  return new Date13(year, month, day, hours, minutes, seconds, milliseconds);
}

function fromGregorian (date: Date): { year: number, month: number, date: number} {
  const daysSinceEpoch = getDaysSinceEpoch(date);

  let year = constants.unixEpochYear();
  let dayOfYear = daysSinceEpoch;

  while (true) {
    const daysInYear = getDaysInYear(year);
    if (dayOfYear < daysInYear) break;
    dayOfYear -= daysInYear;
    year++;
  }

  const months = constants.months();

  let month = 0;
  while (dayOfYear >= months[month]) {
    dayOfYear -= months[month];
    month++;
  }

  const day = dayOfYear + 1;

  return new Date13(year, month, day, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInYear(year: number) {
  return isLeapYear(year) ? 366 : 365;
}

function getDaysSinceEpoch(date: Date): number {
  const epoch = Date.UTC(constants.unixEpochYear(), 0, 1);

  const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  return Math.floor((utc - epoch) / 86400000);
}

const monthNamesEn = getMonthNamesEn(false);
const monthShortNamesEn = getMonthNamesEn(true);

export function getMonthNamesEn(short = false): string[] {
  const formatter = new Intl.DateTimeFormat("en", {
    month: short ? "short" : "long",
    timeZone: "UTC",
  });

  const names: string[] = [];

  for (let month = 0; month < 12; month++) {
    const date = new Date(Date.UTC(constants.unixEpochYear(), month, 1));
    names.push(formatter.format(date));
  }

  return names;
}

