import { DateParts } from './types';

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

  /** can be overriden in a subclass */
  protected parse (dateString: string): number {
    return Date.parse(dateString);
  }

  /** can be overriden in a subclass */
  protected UTC (
    year: number,
    monthIndex: number = 0,
    date: number = 1,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    ms: number = 0
  ): number {
    return Date.UTC(year, monthIndex, date, hours, minutes, seconds, ms);
  }

  public static now (): number {
    return Date.now();
  }

  /* can be overriden in a subclass */
  protected getWeekDay (timestampMs: number, type: 'local' | 'UTC'): number {
    const date = new Date(timestampMs);

    const weekday = date.getDay();
    const utcWeekday = date.getUTCDay();

    return type === 'local' ? weekday : utcWeekday;
  }

  /* essential */

  public setTime (timestampMs: number): number {
    this.utcTimestampMilliseconds = timestampMs;

    this.updateDatePartsCache('setTime');

    return this.utcTimestampMilliseconds;
  }

  protected updateDatePartsCache (source: string) {
    this.utcDatePartsCache = this.getDatePartsFromTimestamp(this.getTime());
    this.localDatePartsCache = this.getDatePartsFromTimestamp(
      this.getLocalTime()
    );
  }

  /* system methods */

  public getTime () {
    return this.utcTimestampMilliseconds ?? NaN;
  }

  public toString () {
    return this.timestampToString(this.utcTimestampMilliseconds);
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
    if (this.timezoneOffsetMinutes === undefined) {
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

  protected setTimezoneOffset (timezoneOffset: number) {
    this.timezoneOffsetMinutes = timezoneOffset;

    this.updateDatePartsCache('setTimezoneOffset');
  }

  public setDate (date: number): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      date,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCDate (date: number): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      date,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setMonth (month: number): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      month,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCMonth (month: number): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      month,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setFullYear (year: number): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      year,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCFullYear (year: number): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
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

  public setHours (
    hours: number,
    minutes?: number,
    seconds?: number,
    miliseconds?: number
  ): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      hour: hours,
      minute: minutes || dateParts.minute,
      second: seconds || dateParts.second,
      millisecond: miliseconds || dateParts.millisecond,
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
      hour: utcHours,
      minute: utcMinutes || dateParts.minute,
      second: utcSeconds || dateParts.second,
      millisecond: utcMiliseconds || dateParts.millisecond,
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
      minute: minutes,
      second: seconds || dateParts.second,
      millisecond: miliseconds || dateParts.millisecond,
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
      minute: utcMinutes,
      second: utcSeconds || dateParts.second,
      millisecond: utcMiliseconds || dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setSeconds (seconds: number, miliseconds?: number): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      second: seconds,
      millisecond: miliseconds || dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCSeconds (utcSeconds: number, utcMiliseconds?: number): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      second: utcSeconds,
      millisecond: utcMiliseconds || dateParts.millisecond,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setMilliseconds (miliseconds: number): number {
    const dateParts = this.toDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      millisecond: miliseconds,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  public setUTCMilliseconds (miliseconds: number): number {
    const dateParts = this.toUTCDateParts();
    const timestamp = this.getTimestampFromDateParts({
      ...dateParts,
      millisecond: miliseconds,
    });
    this.setTime(timestamp);

    return this.getTime();
  }

  /* formatting */

  public toISOString (): string {
    const dateParts = this.toUTCDateParts();
    const {
      year,
      month,
      date,
      hour: hours,
      minute: minutes,
      second: seconds,
    } = dateParts;

    const yearStr = String(year);
    const monthStr = String(month + 1).padStart(2, '0');
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

  public toLocaleString (
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string {
    throw new Error('Override this method in a subclass');
  }

  public toDateString (): string {
    throw new Error('Override this method in a subclass');
  }

  public toTimeString (): string {
    throw new Error('Override this method in a subclass');
  }

  public toLocaleDateString (
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string {
    throw new Error('Override this method in a subclass');
  }

  public toLocaleTimeString (
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string {
    throw new Error('Override this method in a subclass');
  }

  public toUTCString (): string {
    throw new Error('Override this method in a subclass');
  }

  /* custom */

  protected getLocalTime () {
    return this.calculateLocalFromUTCTimestamp(
      this.utcTimestampMilliseconds,
      this.getTimezoneOffset()
    );
  }

  public toDateParts (): DateParts {
    return this.localDatePartsCache;
  }

  public toUTCDateParts (): DateParts {
    return this.utcDatePartsCache;
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

  protected getDatePartsFromTimestamp (timestampMs: number): DateParts {
    if (isNaN(timestampMs)) {
      throw new TypeError('Invalid Date');
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
      dateParts.year ?? 1970,
      dateParts.month,
      dateParts.date,
      dateParts.hour,
      dateParts.minute,
      dateParts.second,
      dateParts.millisecond
    );
  }

  protected timestampToString (timestampMs: number): string {
    if (typeof timestampMs != 'number' || isNaN(timestampMs)) {
      return 'Invalid Date';
    }

    const dateParts = this.getDatePartsFromTimestamp(timestampMs);

    const {
      year,
      month,
      date: dateNumber,
      hour: hours,
      minute: minutes,
      second: seconds,
    } = dateParts;

    const yearStr = String(year);
    const monthStr = String(month + 1).padStart(2, '0');
    const dateStr = String(dateNumber).padStart(2, '0');
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    const timezoneOffsetMinutes = this.getTimezoneOffset();
    const timezoneOffsetHours = Math.floor(
      Math.abs(timezoneOffsetMinutes) / 60
    );
    const timezoneOffsetMinutesRemainder = Math.abs(timezoneOffsetMinutes) % 60;
    const timezoneOffsetSign = timezoneOffsetMinutes < 0 ? '+' : '-';
    const timezoneOffsetStr = `${timezoneOffsetSign}${String(
      timezoneOffsetHours
    ).padStart(2, '0')}:${String(timezoneOffsetMinutesRemainder).padStart(
      2,
      '0'
    )}`;

    const timezoneOffset = timezoneOffsetMinutes
      ? `GMT${timezoneOffsetStr}`
      : '';

    const dateString = `${yearStr}-${monthStr}-${dateStr} ${hoursStr}:${minutesStr}:${secondsStr} ${timezoneOffset}`;

    return dateString;
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

/*
// check if DateAPI satisfies Date interface
function fromDate (d: Date) {
  return new DateAPI().setTime(d.getTime());
}

fromDate(new DateAPI());
 */
