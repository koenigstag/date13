import constants from "./constants";
import { DateParts, Delta } from "./types";

export interface CalendarConfig {
  calendarName: string;
  daysToEpoch: number;
  daysInEra: number;
  yearsInEra: number;

  getIsLeapYear(year: number): boolean;
  getYearOfEra(daysOfEra: number): number;
  getDayOfYear(daysOfEra: number, yearOfEra: number): number;
  getMonths(year: number): number[];

  millisPerDay?: number;
  hoursPerDay?: number;
  minutesPerHour?: number;
  secondsPerMinute?: number;
  millisecondsPerSecond?: number;

  toEpochScale?: (timestamp: number) => number;
  fromEpochScale?: (epochValue: number) => number;
}

export const GregorianCalendarConfig: CalendarConfig = {
  calendarName: constants.gregorianCalendarName,
  yearsInEra: 400, // 400 years is the length of a Gregorian cycle

  daysToEpoch: (() => {
    const epochYear = constants.unixEpochYear;
    let days = 0;
    for (let y = 0; y < epochYear; y++) {
      days += isGregorianLeapYear(y) ? 366 : 365;
    }
    return days;
  })(),

  daysInEra: (() => {
    let total = 0;
    for (let y = 0; y < 400; y++) {
      total += isGregorianLeapYear(y) ? 366 : 365;
    }
    return total;
  })(),

  getIsLeapYear: isGregorianLeapYear,

  getYearOfEra(daysOfEra: number): number {
    let year = 0;
    let days = 0;
    while (year < 400) {
      const len = isGregorianLeapYear(year) ? 366 : 365;
      if (days + len > daysOfEra) break;
      days += len;
      year++;
    }
    return year;
  },

  getDayOfYear(daysOfEra: number, yearOfEra: number): number {
    let days = 0;
    for (let y = 0; y < yearOfEra; y++) {
      days += isGregorianLeapYear(y) ? 366 : 365;
    }
    return daysOfEra - days;
  },

  getMonths(year: number): number[] {
    return [
      31,
      isGregorianLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
  },
};

function isGregorianLeapYear(year: number): boolean {
  // Gregorian leap year rules
  if (year % 4 !== 0) return false;
  if (year % 100 === 0 && year % 400 !== 0) return false;

  // Amosov's rule for Gregorian leap years
  if (year % 3200 === 0 && year % 12800 !== 0) return false;

  return true;
}

export const Ordo13CalendarConfig: CalendarConfig = {
  ...GregorianCalendarConfig,

  calendarName: constants.date13CalendarName,

  getMonths(year) {
    return [
      28,
      28,
      28,
      28,

      28,
      28,
      28,
      28,

      28,
      28,
      28,
      28,

      isGregorianLeapYear(year) ? 30 : 29,
    ];
  },
};

export const AMC_MSD_CalendarConfig: CalendarConfig = {
  calendarName: "amc_msd",

  millisPerDay: 88775244.147, // mars sol duration in milliseconds
  daysToEpoch: 69972,
  yearsInEra: 100,

  daysInEra: (() => {
    let days = 0;
    for (let y = 0; y < 100; y++) {
      days += isAMCLeapYear(y) ? 669 : 668;
    }
    return days;
  })(),

  getIsLeapYear: isAMCLeapYear,

  getYearOfEra(daysOfEra: number): number {
    let year = 0;
    let days = 0;
    while (year < 100) {
      const len = isAMCLeapYear(year) ? 669 : 668;
      if (days + len > daysOfEra) break;
      days += len;
      year++;
    }
    return year;
  },

  getDayOfYear(daysOfEra: number, yearOfEra: number): number {
    let days = 0;
    for (let y = 0; y < yearOfEra; y++) {
      days += isAMCLeapYear(y) ? 669 : 668;
    }
    return daysOfEra - days;
  },

  getMonths(year: number): number[] {
    // divide a year to 24 months 28 sol (day) each + 1 in the end
    const base = Array(24).fill(28); // 24 months 28 sol each = 672
    const correction = isAMCLeapYear(year) ? -3 : -4; // to calc 669 / 668
    base[base.length - 1] += correction; // last month is 29 or 28 sol
    return base;
  },
};

function isAMCLeapYear(year: number): boolean {
  const current = (year + 1) * 0.5907;
  const previous = year * 0.5907;
  return Math.floor(current) > Math.floor(previous);
}

export class CalendarEngine {
  constructor(private readonly config: CalendarConfig) {}

  public static get Gregorian() {
    return this.create(GregorianCalendarConfig);
  }

  public static get Ordo13() {
    return this.create(Ordo13CalendarConfig);
  }

  public static get AMC_MSD() {
    return this.create(AMC_MSD_CalendarConfig);
  }

  public static create(config: CalendarConfig): CalendarEngine {
    return new CalendarEngine(config);
  }

  public toEpochValue(timestamp: number): number {
    return this.config.toEpochScale
      ? this.config.toEpochScale(timestamp)
      : timestamp;
  }

  public fromEpochValue(epochValue: number): number {
    return this.config.fromEpochScale
      ? this.config.fromEpochScale(epochValue)
      : epochValue;
  }

  public isSameDay(ts1: number | Date, ts2: number | Date): boolean {
    const d1 = Math.floor(
      this.getDaysInMilliseconds(typeof ts1 === "number" ? ts1 : ts1.getTime())
    );
    const d2 = Math.floor(
      this.getDaysInMilliseconds(typeof ts2 === "number" ? ts2 : ts2.getTime())
    );
    return d1 === d2;
  }

  public get calendarName(): string {
    return this.config.calendarName;
  }

  public get daysInEra(): number {
    return this.config.daysInEra;
  }

  public get yearsInEra(): number {
    return this.config.yearsInEra;
  }

  public get daysToEpoch(): number {
    return this.config.daysToEpoch;
  }

  public get millisecondsPerDay(): number {
    if (this.config.millisPerDay) {
      return this.config.millisPerDay;
    }

    const { hpd, mph, spm, mps } = this.getTimeStructure();

    return hpd * mph * spm * mps;
  }

  public getEraIndexFromDays(days: number): number {
    return Math.floor(days / this.daysInEra);
  }

  public getEraIndexFromYear(year: number): number {
    return Math.floor(year / this.yearsInEra);
  }

  public getYearIndexInEra(years: number): number {
    return years % this.yearsInEra;
  }

  public getDaysIntoCurrentEra(era: number): number {
    return era % this.daysInEra;
  }

  public getTotalDaysBeforeEra(fullEras: number): number {
    return fullEras * this.daysInEra;
  }

  public getTotalYearsBeforeEra(eras: number): number {
    return eras * this.yearsInEra;
  }

  public getMillisecondsInDays(days: number): number {
    return days * this.millisecondsPerDay;
  }

  public getDaysInMilliseconds(ms: number): number {
    return ms / this.millisecondsPerDay;
  }

  public getTotalMonthsBeforeYear(year: number): number {
    return year * this.getMonthsPerYear();
  }

  public getMonthIndexInYear(month: number): number {
    return month % this.getMonthsPerYear();
  }

  public getYearFromTotalMonths(months: number): number {
    return Math.floor(months / this.getMonthsPerYear());
  }

  public isLeapYear(year: number): boolean {
    return this.config.getIsLeapYear(year);
  }

  public getMonths(year: number): number[] {
    return this.config.getMonths(year);
  }

  public getDaysInMonth(year: number, month: number): number {
    const { year: normalizedYear, month: normalizedMonth } =
      this.normalizeMonth(year, month);

    const months = this.getMonths(normalizedYear);
    return months[normalizedMonth];
  }

  public getMonthsPerYear(): number {
    return this.getMonths(1).length;
  }

  public getYearIndexFromDaysOfEra(daysOfEra: number): number {
    return this.config.getYearOfEra(daysOfEra);
  }

  public getDayOffsetInYear(daysOfEra: number, yearOfEra: number) {
    return this.config.getDayOfYear(daysOfEra, yearOfEra);
  }

  public getTotalDays(year: number, month?: number): number {
    const months = this.getMonths(year);
    return months
      .slice(0, month ?? months.length)
      .reduce((sum, d) => sum + d, 0);
  }

  public fromDateParts(dateParts: DateParts): number {
    if (
      [
        dateParts.year,
        dateParts.month,
        dateParts.date,
        dateParts.hour,
        dateParts.minute,
        dateParts.second,
        dateParts.millisecond,
      ].some((v) => isNaN(v))
    ) {
      return NaN;
    }

    const normalized = this.normalizeDateParts(dateParts);
    const { year, month, date, hour, minute, second, millisecond } = normalized;

    const fullEras = this.getEraIndexFromYear(year);
    const yearOfEra = this.getYearIndexInEra(year);

    let totalDays = this.getTotalDaysBeforeEra(fullEras);

    const baseYear = this.getTotalYearsBeforeEra(fullEras);

    for (let y = 0; y < yearOfEra; y++) {
      const yAbs = baseYear + y;
      totalDays += this.getTotalDays(yAbs);
    }

    const daysIntoYear = this.getTotalDays(year, month) + date - 1;
    totalDays += daysIntoYear;
    totalDays -= this.daysToEpoch;

    const timeMs = this.getMillisecondsFromTimeParts(
      hour,
      minute,
      second,
      millisecond
    );

    const rawTimestamp = this.getMillisecondsInDays(totalDays) + timeMs;

    return this.toEpochValue(rawTimestamp);
  }

  public toDateParts(timestamp: number): DateParts {
    if (isNaN(timestamp)) {
      return {
        calendar: this.calendarName,
        year: NaN,
        month: NaN,
        date: NaN,
        hour: NaN,
        minute: NaN,
        second: NaN,
        millisecond: NaN,
      };
    }

    const normalizedTimestamp = this.fromEpochValue(timestamp);

    const totalDays = this.getDaysInMilliseconds(normalizedTimestamp);
    const daysSinceEpoch = Math.floor(totalDays);
    let msWithinDay =
      normalizedTimestamp - this.getMillisecondsInDays(daysSinceEpoch);

    if (msWithinDay < 0) {
      msWithinDay += this.millisecondsPerDay;
    }

    const { year, monthIndex, date } = this.getDateFromDays(daysSinceEpoch);
    const { hour, minute, second, millisecond } =
      this.getTimePartsFromMilliseconds(msWithinDay);

    return {
      calendar: this.calendarName,
      year,
      month: monthIndex,
      date,
      hour,
      minute,
      second,
      millisecond,
    };
  }

  public add(timestamp: number, delta: Delta): number {
    const parts = this.toDateParts(timestamp);
    let { year, month, date, hour, minute, second, millisecond } = parts;

    if (delta.years) {
      year += delta.years;
    }

    if (delta.months) {
      const monthsInYear = this.getMonthsPerYear();
      const totalMonths =
        this.getTotalMonthsBeforeYear(year) + month + delta.months;
      year = this.getYearFromTotalMonths(totalMonths);
      month = this.getMonthIndexInYear(totalMonths);
      if (month < 0) {
        month += monthsInYear;
        year -= 1;
      }
    }

    const { hpd, mph, spm, mps } = this.getTimeStructure();

    const msPerHour = this.millisecondsPerDay / hpd;
    const msPerMinute = msPerHour / mph;
    const msPerSecond = msPerMinute / spm;

    const extraMs =
      (delta.hours ?? 0) * msPerHour +
      (delta.minutes ?? 0) * msPerMinute +
      (delta.seconds ?? 0) * msPerSecond +
      (delta.milliseconds ?? 0);

    const baseTs = this.fromDateParts({
      calendar: this.calendarName,
      year,
      month,
      date: date,
      hour,
      minute,
      second,
      millisecond,
    });
    const dayAdjusted = delta.days
      ? baseTs + this.getMillisecondsInDays(delta.days)
      : baseTs;

    return dayAdjusted + extraMs;
  }

  public sub(timestamp: number, delta: Delta): number {
    return this.add(timestamp, {
      years: delta.years ? -delta.years : 0,
      months: delta.months ? -delta.months : 0,
      days: delta.days ? -delta.days : 0,
      hours: delta.hours ? -delta.hours : 0,
      minutes: delta.minutes ? -delta.minutes : 0,
      seconds: delta.seconds ? -delta.seconds : 0,
      milliseconds: delta.milliseconds ? -delta.milliseconds : 0,
    });
  }

  public set(timestamp: number, dateParts: Partial<DateParts>): number {
    const current = this.toDateParts(timestamp);
    return this.fromDateParts({
      calendar: current.calendar,
      year: dateParts.year ?? current.year,
      month: dateParts.month ?? current.month,
      date: dateParts.date ?? current.date,
      hour: dateParts.hour ?? current.hour,
      minute: dateParts.minute ?? current.minute,
      second: dateParts.second ?? current.second,
      millisecond: dateParts.millisecond ?? current.millisecond,
    });
  }

  private getTimeStructure() {
    const c = this.config;
    return {
      hpd: c.hoursPerDay ?? constants.hoursPerDay,
      mph: c.minutesPerHour ?? constants.minutesPerHour,
      spm: c.secondsPerMinute ?? constants.secondsPerMinute,
      mps: c.millisecondsPerSecond ?? constants.millisecondsPerSecond,
    };
  }

  private getMillisecondsFromTimeParts(
    hour: number,
    minute: number,
    second: number,
    millisecond: number
  ): number {
    const { hpd, mph, spm, mps } = this.getTimeStructure();

    const hourInMs = hour * mph * spm * mps;
    const minuteInMs = minute * spm * mps;
    const secondInMs = second * mps;
    const millisAbsolute = hourInMs + minuteInMs + secondInMs + millisecond;

    const millisPerDay = hpd * mph * spm * mps;
    return (millisAbsolute / millisPerDay) * this.millisecondsPerDay;
  }

  private getTimePartsFromMilliseconds(ms: number) {
    const { hpd, mph, spm } = this.getTimeStructure();

    const msPerHour = this.millisecondsPerDay / hpd;
    const msPerMinute = msPerHour / mph;
    const msPerSecond = msPerMinute / spm;

    const hour = Math.floor(ms / msPerHour);
    ms -= hour * msPerHour;

    const minute = Math.floor(ms / msPerMinute);
    ms -= minute * msPerMinute;

    const second = Math.floor(ms / msPerSecond);
    ms -= second * msPerSecond;

    const millisecond = ms;

    return { hour, minute, second, millisecond };
  }

  private getDateFromDays(daysSinceEpoch: number) {
    const totalDays = daysSinceEpoch + this.daysToEpoch;
    const era = this.getEraIndexFromDays(totalDays);
    const daysOfEra = totalDays - this.getTotalDaysBeforeEra(era);

    const yoe = this.getYearIndexFromDaysOfEra(daysOfEra);
    const year = this.getTotalYearsBeforeEra(era) + yoe;
    const doy = this.getDayOffsetInYear(daysOfEra, yoe);

    const months = this.getMonths(year);

    let remaining = doy;
    for (let i = 0; i < months.length; i++) {
      if (remaining < months[i]) {
        return { year, monthIndex: i, date: remaining + 1 };
      }
      remaining -= months[i];
    }

    throw new Error("Invalid dayOfYear");
  }

  private normalizeDateParts(parts: DateParts): DateParts {
    let { year, month, date, hour, minute, second, millisecond } = parts;

    const totalMs = this.getMillisecondsFromTimeParts(
      hour,
      minute,
      second,
      millisecond
    );

    const millisPerDay = this.millisecondsPerDay;
    const overflowDays = Math.floor(this.getDaysInMilliseconds(totalMs));
    const timeParts = this.getTimePartsFromMilliseconds(this.normalizeModulo(totalMs, millisPerDay));

    date += overflowDays;

    ({ year, month } = this.normalizeMonth(year, month));

    const MAX_ITER = 100;

    const normalizeDayForward = () => {
      for (let i = 0; i < MAX_ITER; i++) {
        const daysInMonth = this.getDaysInMonth(year, month);
        if (date <= daysInMonth) break;

        date -= daysInMonth;
        ({ year, month } = this.normalizeMonth(year, month + 1));

        if (i === MAX_ITER - 1) {
          throw new Error(
            `normalizeDateParts: forward day normalization exceeded ${MAX_ITER} iterations`
          );
        }
      }
    };

    const normalizeDayBackward = () => {
      for (let i = 0; i < MAX_ITER; i++) {
        if (date > 0) break;

        ({ year, month } = this.normalizeMonth(year, month - 1));
        date += this.getDaysInMonth(year, month);

        if (i === MAX_ITER - 1) {
          throw new Error(
            `normalizeDateParts: backward day normalization exceeded ${MAX_ITER} iterations`
          );
        }
      }
    };

    normalizeDayForward();
    normalizeDayBackward();

    return {
      calendar: parts.calendar,
      year,
      month,
      date,
      ...timeParts,
    };
  }

  private normalizeMonth(
    year: number,
    month: number
  ): { year: number; month: number } {
    const baseMonthCount = this.getMonthsPerYear();
    const totalMonths = year * baseMonthCount + month;
    year = Math.floor(totalMonths / baseMonthCount);
    month = this.normalizeModulo(totalMonths, baseMonthCount);
    return { year, month };
  }

  private normalizeModulo (val: number, base: number) {
    return ((val % base) + base) % base;
  }
}
