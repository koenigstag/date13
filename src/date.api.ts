import { DateParts } from "./types";

/*  */
export class DateAPI {
  private timestampMs: number;
  private timezoneOffsetMinutes: number;

  private utcDatePartsCache: DateParts;
  private localDatePartsCache: DateParts;

  constructor(param1?: number | string | Date, param2?: number, param3?: number, param4?: number, param5?: number, param6?: number, param7?: number) {
    this.timezoneOffsetMinutes = DateAPI.getTimezoneOffsetMinutes();
    this.timestampMs = DateAPI.getTimestampFromConstructorParams(param1, param2, param3, param4, param5, param6, param7);

    this.updateDatePartsCache();
  }

  /* static methods */

  /** can be overriden in a subclass */
  public static parse (dateString: string): number {
    return Date.parse(dateString);
  }

  /** can be overriden in a subclass */
  public static UTC (year: number, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number {
    return Date.UTC(year, month, date, hours, minutes, seconds, ms);
  }

  public static now (): number {
    return Date.now();
  }

  /* can be overriden in a subclass */
  protected static getDay (timestampMs: number, type: 'local' | 'utc'): number {
    const date = new Date(timestampMs);

    const weekday = date.getDay();
    const utcWeekday = date.getUTCDay();

    return type === 'local' ? weekday : utcWeekday;
  }

  /* essential */

  public setTime (timestampMs: number): number {
    this.timestampMs = timestampMs;

    this.updateDatePartsCache();

    return this.timestampMs;
  }

  protected updateDatePartsCache () {
    this.utcDatePartsCache = DateAPI.getDatePartsFromTimestamp(this.getTime());
    this.localDatePartsCache = DateAPI.getDatePartsFromTimestamp(this.getLocalTime());
  }

  /* system methods */

  public getTime () {
    return this.timestampMs ?? NaN;
  }

  public toString () {
    return DateAPI.timestampToString(this.timestampMs);
  }

  public valueOf () {
    return this.getTime();
  }

  [Symbol.toPrimitive] (hint: string): any {
    if (hint === 'number') {
      return this.getTime();
    }

    if (hint === 'string') {
      return this.toString();
    }

    return this.toString();
  }

  /* getters */

  public getTimezoneOffset () {
    return this.timezoneOffsetMinutes;
  }

  protected getLocalTime () {
    return DateAPI.getLocalTime(this.timestampMs, this.timezoneOffsetMinutes);
  }

  protected getTimezoneOffsetInMilliseconds () {
    return DateAPI.minutesToMilliseconds(this.timezoneOffsetMinutes);
  }

  public getDay (): number {
    return DateAPI.getDay(this.getTime(), 'local');
  }

  public getUTCDay (): number {
    return DateAPI.getDay(this.getTime(), 'utc');
  }

  public getDate (): number {
    const { date } = this.getDateParts();

    return date;
  }

  public getUTCDate (): number {
    const { date } = this.getUTCDateParts();

    return date;
  }

  public getMonth (): number {
    const { month } = this.getDateParts();

    return month;
  }

  public getUTCMonth (): number {
    const { month } = this.getUTCDateParts();

    return month;
  }

  public getFullYear (): number {
    const { year } = this.getDateParts();

    return year;
  }

  public getUTCFullYear (): number {
    const { year } = this.getUTCDateParts();

    return year;
  }

  public getHours (): number {
    const { hour: hours } = this.getDateParts();

    return hours;
  }

  public getUTCHours (): number {
    const { hour: hours } = this.getUTCDateParts();

    return hours;
  }

  public getMinutes (): number {
    const { minute: minutes } = this.getDateParts();

    return minutes;
  }

  public getUTCMinutes (): number {
    const { minute: minutes } = this.getUTCDateParts();

    return minutes;
  }

  public getSeconds (): number {
    const { second: seconds } = this.getDateParts();

    return seconds;
  }

  public getUTCSeconds (): number {
    const { second: seconds } = this.getUTCDateParts();

    return seconds;
  }

  public getMilliseconds (): number {
    const { millisecond: miliseconds } = this.getDateParts();

    return miliseconds;
  }

  public getUTCMilliseconds (): number {
    const { millisecond: miliseconds } = this.getUTCDateParts();

    return miliseconds;
  }

  public getDateParts (): DateParts {
    return this.localDatePartsCache;
  }

  public getUTCDateParts (): DateParts {
    return this.utcDatePartsCache;
  }

  /* setters */

  protected setTimezoneOffset (timezoneOffset: number) {
    this.timezoneOffsetMinutes = timezoneOffset;

    this.updateDatePartsCache();
  }

  public setDate (date: number): number {
    const dateParts = this.getDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      date,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCDate (date: number): number {
    const dateParts = this.getUTCDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      date,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setMonth (month: number): number {
    const dateParts = this.getDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      month,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCMonth (month: number): number {
    const dateParts = this.getUTCDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      month,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setFullYear (year: number): number {
    const dateParts = this.getDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      year,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCFullYear (year: number): number {
    const dateParts = this.getUTCDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      year,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  /** @deprecated */
  public setYear (year2: number) {
    const fullYear = 1900 + year2;

    this.setFullYear(fullYear);

    return this.getTime();
  }

  public setHours (hours: number, minutes?: number, seconds?: number, miliseconds?: number): number {
    const dateParts = this.getDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      hour: hours,
      minute: minutes || dateParts.minute,
      second: seconds || dateParts.second,
      millisecond: miliseconds || dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCHours (utcHours: number, utcMinutes?: number, utcSeconds?: number, utcMiliseconds?: number): number {
    const dateParts = this.getUTCDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      hour: utcHours,
      minute: utcMinutes || dateParts.minute,
      second: utcSeconds || dateParts.second,
      millisecond: utcMiliseconds || dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setMinutes (minutes: number, seconds?: number, miliseconds?: number): number {
    const dateParts = this.getDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      minute: minutes,
      second: seconds || dateParts.second,
      millisecond: miliseconds || dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCMinutes (utcMinutes: number, utcSeconds?: number, utcMiliseconds?: number): number {
    const dateParts = this.getUTCDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      minute: utcMinutes,
      second: utcSeconds || dateParts.second,
      millisecond: utcMiliseconds || dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setSeconds (seconds: number, miliseconds?: number): number {
    const dateParts = this.getDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      second: seconds,
      millisecond: miliseconds || dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCSeconds (utcSeconds: number, utcMiliseconds?: number): number {
    const dateParts = this.getUTCDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      second: utcSeconds,
      millisecond: utcMiliseconds || dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setMilliseconds (miliseconds: number): number {
    const dateParts = this.getDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      millisecond: miliseconds,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCMilliseconds (miliseconds: number): number {
    const dateParts = this.getUTCDateParts();
    const timestamp = DateAPI.getTimestampFromDateParts({
      ...dateParts,
      millisecond: miliseconds,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  /* formatting */

  /**
   * @experimental
   * @deprecated experimental
   * @see [Proposal](https://tc39.es/proposal-temporal/docs/instant.html)
   * @see [MDN doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant)
   */
  public toTemporalInstant (): unknown {
    throw new Error('Override this method in a subclass');
  }

  public toISOString (): string {
    const dateParts = this.getUTCDateParts();
    const { year, month, date, hour: hours, minute: minutes, second: seconds } = dateParts;

    const yearStr = String(year);
    const monthStr = String(month).padStart(2, '0');
    const dateStr = String(date).padStart(2, '0');
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    const milisecondsStr = String(dateParts.millisecond).padStart(3, '0');

    return `${yearStr}-${monthStr}-${dateStr}T${hoursStr}:${minutesStr}:${secondsStr}.${milisecondsStr}Z`;
  }

  public toJSON (): string {
    return this.toISOString();
  }

  public toLocaleString (locales?: string | string[], options?: Intl.DateTimeFormatOptions): string {
    throw new Error('Override this method in a subclass');
  }

  public toDateString (): string {
    throw new Error('Override this method in a subclass');
  }

  public toTimeString (): string {
    throw new Error('Override this method in a subclass');
  }

  public toLocaleDateString (locales?: string | string[], options?: Intl.DateTimeFormatOptions): string {
    throw new Error('Override this method in a subclass');
  }

  public toLocaleTimeString (locales?: string | string[], options?: Intl.DateTimeFormatOptions): string {
    throw new Error('Override this method in a subclass');
  }

  public toUTCString (): string {
    throw new Error('Override this method in a subclass');
  }

  protected static getTimestampFromConstructorParams (...params: any): number {
    const param1 = params[0];
    const param2 = params[1];
    const param3 = params[2];
    const param4 = params[3];
    const param5 = params[4];
    const param6 = params[5];
    const param7 = params[6];

    if (params.length === 0) {
      // if no params, return current timestamp
      return this.now();
    } else if (params.length === 1) {
      if (typeof param1 === 'string') {
        // if param is string, parse it to timestamp
        const timestampMs = this.parse(param1);
        return timestampMs;
      }

      if (typeof param1 === 'object' && typeof param1.valueOf === 'function') {
        // looking for Date.prototype.valueOf or similar
        // if param is object, call valueOf
        return param1.valueOf();
      }

      // if param is number, check it
      if (typeof param1 === 'number') {
        if (isNaN(param1)) {
          return NaN;
        }

        if (param1 <= Number.MIN_SAFE_INTEGER || param1 < -8_640_000_000_000_000) {
          return NaN;
        }

        if (param1 >= Number.MAX_SAFE_INTEGER || param1 > 8_640_000_000_000_000) {
          return NaN;
        }

        // if param is valid timestamp
        const timestampMs = param1;

        return timestampMs;
      }
    } else if (params.length >= 2) {
      // if params are numbers, convert them to timestamp
      const timestampMs = this.UTC(param1, param2, param3, param4, param5, param6, param7);
      const timezoneOffsetInMilliseconds = DateAPI.getTimezoneOffsetMinutes() * 60 * 1000;

      return timestampMs - timezoneOffsetInMilliseconds;
    }

    // cannot convert params to timestamp
    return NaN;
  }

  protected static getTimezoneOffsetMinutes (): number {
    const date = new Date();

    return date.getTimezoneOffset();
  }

  protected static minutesToMilliseconds (timezoneOffsetMinutes: number): number {
    const secondsInMinute = 60;
    const millisecondsInSecond = 1000;
    return timezoneOffsetMinutes * secondsInMinute * millisecondsInSecond;
  }

  protected static getLocalTime (timestampMs: number, timezoneOffsetMinutes: number): number {
    const timezoneOffsetInMilliseconds = DateAPI.minutesToMilliseconds(timezoneOffsetMinutes);

    // timezoneOffset for GMT+3 = -180
    // timestampMs - (-180) = timestamp + 180 = local time
    return timestampMs - timezoneOffsetInMilliseconds;
  }

  protected static getDatePartsFromTimestamp (timestampMs: number): DateParts {
    if (isNaN(timestampMs)) {
      throw new TypeError('Invalid Date');
    }

    throw new Error('Override this method in a subclass');
  }

  protected static getTimestampFromDateParts (dateParts: Partial<DateParts>): number {
    if (!dateParts) {
      throw new TypeError('Date parts are required');
    }

    throw new Error('Override this method in a subclass');
  }

  protected static timestampToString (timestampMs: number): string {
    if (typeof timestampMs != 'number' || isNaN(timestampMs)) {
      return 'Invalid Date';
    }

    throw new Error('Override this method in a subclass');
  }
}

/*
// check if DateAPI satisfies Date interface
function fromDate(d: Date) {
  return new DateAPI().setTime(d.getTime());
}

fromDate(new DateAPI());
 */
