import { DateParts } from './types';

/**
 * DateAPI is a class that provides an interface satisfying JS native Date interface with its full functionality written in TypeScript.
 * It is a wrapper around the native Date object and provides a consistent API for working with dates and times.
 *
 * It can be used as an open-source replacement for the native Date object.
 * Also it can be extended to support different calendars and date formats - you can override the parse and UTC methods to implement your own.
 */
export class DateAPI {
  protected utcTimestampMilliseconds: number = NaN;
  protected timezoneOffsetMinutes: number = 0;

  protected utcDatePartsCache: DateParts;
  protected localDatePartsCache: DateParts;

  constructor (...params: (number | string | undefined | Date)[]) {
    this.timezoneOffsetMinutes = this.getDefaultTimezoneOffset();
    this.utcTimestampMilliseconds = this.getTimestampFromConstructorParams(
      ...params
    );

    this.updateDatePartsCache('constructor');
  }

  /* core methods */

  /** Can be overriden in a subclass */
  protected parse (dateString: string): number {
    return Date.parse(dateString);
  }

  /** Can be overriden in a subclass */
  protected UTC (
    year: number,
    monthIndex: number = 0,
    date: number = 1,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    ms: number = 0
  ): number {
    return Date.UTC(year ?? 1970, monthIndex, date, hours, minutes, seconds, ms);
  }

  public static now (): number {
    return Date.now();
  }

  /* system methods */

  public toString () {
    return new Date(this.getTime()).toString();
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

  public getTime () {
    return this.utcTimestampMilliseconds ?? NaN;
  }

  public getTimezoneOffset () {
    if (typeof this.timezoneOffsetMinutes !== 'number') {
      this.timezoneOffsetMinutes = this.getDefaultTimezoneOffset();
    }

    return this.timezoneOffsetMinutes;
  }

  public getDay (): number {
    return this.getWeekDay(this.getTime(), 'local');
  }

  public getUTCDay (): number {
    return this.getWeekDay(this.getTime(), 'UTC');
  }

  public getDate (): number {
    const { date } = this.toDateParts();

    return date;
  }

  public getUTCDate (): number {
    const { date } = this.toUTCDateParts();

    return date;
  }

  public getMonth (): number {
    const { month } = this.toDateParts();

    return month;
  }

  public getUTCMonth (): number {
    const { month } = this.toUTCDateParts();

    return month;
  }

  public getFullYear (): number {
    const { year } = this.toDateParts();

    return year;
  }

  public getUTCFullYear (): number {
    const { year } = this.toUTCDateParts();

    return year;
  }

  public getHours (): number {
    const { hour: hours } = this.toDateParts();

    return hours;
  }

  public getUTCHours (): number {
    const { hour: hours } = this.toUTCDateParts();

    return hours;
  }

  public getMinutes (): number {
    const { minute: minutes } = this.toDateParts();

    return minutes;
  }

  public getUTCMinutes (): number {
    const { minute: minutes } = this.toUTCDateParts();

    return minutes;
  }

  public getSeconds (): number {
    const { second: seconds } = this.toDateParts();

    return seconds;
  }

  public getUTCSeconds (): number {
    const { second: seconds } = this.toUTCDateParts();

    return seconds;
  }

  public getMilliseconds (): number {
    const { millisecond: miliseconds } = this.toDateParts();

    return miliseconds;
  }

  public getUTCMilliseconds (): number {
    const { millisecond: miliseconds } = this.toUTCDateParts();

    return miliseconds;
  }

  /* setters */

  public setTime (timestampMs: number): number {
    this.utcTimestampMilliseconds = timestampMs;

    this.updateDatePartsCache('setTime');

    return this.utcTimestampMilliseconds;
  }

  public setDate (date: number): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      date: date ?? dateParts.date,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCDate (date: number): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      date: date ?? dateParts.date,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setMonth (month: number): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      month: month ?? dateParts.month,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCMonth (month: number): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      month: month ?? dateParts.month,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setFullYear (year: number): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      year: year ?? dateParts.year,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCFullYear (year: number): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      year: year ?? dateParts.year,
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

  public setHours (
    hours: number,
    minutes?: number,
    seconds?: number,
    miliseconds?: number
  ): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      hour: hours ?? dateParts.hour,
      minute: minutes ?? dateParts.minute,
      second: seconds ?? dateParts.second,
      millisecond: miliseconds ?? dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCHours (
    utcHours: number,
    utcMinutes?: number,
    utcSeconds?: number,
    utcMiliseconds?: number
  ): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      hour: utcHours ?? dateParts.hour,
      minute: utcMinutes ?? dateParts.minute,
      second: utcSeconds ?? dateParts.second,
      millisecond: utcMiliseconds ?? dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setMinutes (
    minutes: number,
    seconds?: number,
    miliseconds?: number
  ): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      minute: minutes ?? dateParts.minute,
      second: seconds ?? dateParts.second,
      millisecond: miliseconds ?? dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCMinutes (
    utcMinutes: number,
    utcSeconds?: number,
    utcMiliseconds?: number
  ): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      minute: utcMinutes ?? dateParts.minute,
      second: utcSeconds ?? dateParts.second,
      millisecond: utcMiliseconds ?? dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setSeconds (seconds: number, miliseconds?: number): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      second: seconds ?? dateParts.second,
      millisecond: miliseconds ?? dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCSeconds (utcSeconds: number, utcMiliseconds?: number): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      second: utcSeconds ?? dateParts.second,
      millisecond: utcMiliseconds ?? dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setMilliseconds (miliseconds: number): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      millisecond: miliseconds ?? dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCMilliseconds (miliseconds: number): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      millisecond: miliseconds ?? dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  /* formatting */

  public toISOString (): string {
    return new Date(this.getTime()).toISOString();
  }

  public toJSON (): string {
    return this.toISOString();
  }

  public toDateString (): string {
    return new Date(this.getTime()).toDateString();
  }

  public toTimeString (): string {
    return new Date(this.getTime()).toTimeString();
  }

  public toUTCString (): string {
    return new Date(this.getTime()).toUTCString();
  }

  public toLocaleString (
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string {
    return new Date(this.getTime()).toLocaleString(locales, options);
  }

  public toLocaleDateString (
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string {
    return new Date(this.getTime()).toLocaleDateString(locales, options);
  }

  public toLocaleTimeString (
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string {
    return new Date(this.getTime()).toLocaleTimeString(locales, options);
  }

  /* custom */

  public isValid(): boolean {
    return isNaN(this.getTime());
  }

  public toDateParts (): DateParts {
    return this.localDatePartsCache;
  }

  public toUTCDateParts (): DateParts {
    return this.utcDatePartsCache;
  }

  protected getWeekDay (timestampMs: number, type: 'local' | 'UTC'): number {
    const date = new Date(timestampMs);

    return type === 'local' ? date.getDay() : date.getUTCDay();
  }

  protected updateDatePartsCache (source: string) {
    this.utcDatePartsCache = this.getDatePartsFromTimestamp(this.getTime());
    this.localDatePartsCache = this.getDatePartsFromTimestamp(
      this.getLocalTime()
    );
  }

  protected setTimezoneOffset (timezoneOffset: number) {
    this.timezoneOffsetMinutes = timezoneOffset;

    this.updateDatePartsCache('setTimezoneOffset');
  }

  protected getLocalTime () {
    return this.calculateLocalFromUTCTimestamp(
      this.utcTimestampMilliseconds,
      this.getTimezoneOffset()
    );
  }

  protected getTimestampFromConstructorParams (...params: any[]): number {
    params = params.filter((p: any) => !(p === undefined || p === null));

    const param1 = params[0];
    const param2 = params[1];
    const param3 = params[2];
    const param4 = params[3];
    const param5 = params[4];
    const param6 = params[5];
    const param7 = params[6];

    if (params.length === 0) {
      // if no params, return current timestamp
      return DateAPI.now();
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

        if (
          param1 <= Number.MIN_SAFE_INTEGER ||
          param1 < -8_640_000_000_000_000
        ) {
          return NaN;
        }

        if (
          param1 >= Number.MAX_SAFE_INTEGER ||
          param1 > 8_640_000_000_000_000
        ) {
          return NaN;
        }

        // if param is valid timestamp
        const timestampMs = param1;

        return timestampMs;
      }
    } else if (params.length >= 2) {
      // if params are numbers, convert them to timestamp

      const timestampMs = this.UTC(
        param1,
        param2,
        param3,
        param4,
        param5,
        param6,
        param7
      );

      const localTimestampMs = this.calculateUTCFromLocalTimestamp(
        timestampMs,
        this.getDefaultTimezoneOffset()
      );

      return localTimestampMs;
    }

    // cannot convert params to timestamp
    return NaN;
  }

  /** Can be overriden in a subclass */
  protected getDatePartsFromTimestamp (timestampMs: number): DateParts {
    if (isNaN(timestampMs)) {
      return {
        calendar: 'gregorian',
        year: NaN,
        month: NaN,
        date: NaN,
        hour: NaN,
        minute: NaN,
        second: NaN,
        millisecond: NaN,
      };
    }

    const date = new Date(timestampMs);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const dateNumber = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    const milliseconds = date.getUTCMilliseconds();

    const dateParts: DateParts = {
      calendar: 'gregorian',
      year,
      month,
      date: dateNumber,
      hour: hours,
      minute: minutes,
      second: seconds,
      millisecond: milliseconds,
    };

    return dateParts;
  }

  protected getTimestampFromDateParts (dateParts: Partial<DateParts>): number {
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

  /* utils */

  protected getTimezoneOffsetInMilliseconds (): number {
    const timezoneOffset = this.getTimezoneOffset();

    return this.minutesToMilliseconds(timezoneOffset);
  }

  protected getDefaultTimezoneOffset (): number {
    const date = new Date();

    return date.getTimezoneOffset();
  }

  protected minutesToMilliseconds (timezoneOffsetMinutes: number): number {
    const secondsInMinute = 60;
    const millisecondsInSecond = 1000;
    return timezoneOffsetMinutes * secondsInMinute * millisecondsInSecond;
  }

  protected calculateLocalFromUTCTimestamp (
    timestampMs: number,
    timezoneOffsetMinutes: number
  ): number {
    const timezoneOffsetInMilliseconds = this.minutesToMilliseconds(
      timezoneOffsetMinutes
    );

    // timezoneOffset for GMT+3 = -180
    // utc timestamp - (-180) = timestamp + 180 = local time
    return timestampMs - timezoneOffsetInMilliseconds;
  }

  protected calculateUTCFromLocalTimestamp (
    timestampMs: number,
    timezoneOffsetMinutes: number
  ): number {
    const timezoneOffsetInMilliseconds = this.minutesToMilliseconds(
      timezoneOffsetMinutes
    );

    // timezoneOffset for GMT+3 = -180
    // local timestamp + (-180) = timestamp - 180 = utc time
    return timestampMs + timezoneOffsetInMilliseconds;
  }
}
