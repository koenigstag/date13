import constants from './constants';
import type { CalendarType, DateInfo, DateParts } from './types';
import utils from './utils';

/* overflow date parts */
export function overflowDateParts (parts: DateParts): DateParts {
  let {
    calendar,
    year,
    month: monthIndex,
    date,
    hour = 0,
    minute = 0,
    second = 0,
    milisecond = 0,
    timezoneOffset,
  } = { ...parts };

  const months = utils.getMonthLengths(year, calendar);
  const monthsInYear = months.length;

  // overflow second
  if (milisecond > constants.milisInSecond - 1) {
    second += Math.floor(milisecond / constants.milisInSecond);
    milisecond = milisecond % constants.milisInSecond;
  }

  // overflow minute
  if (second > constants.secondsInMinute - 1) {
    minute += Math.floor(second / constants.secondsInMinute);
    second = second % constants.secondsInMinute;
  }

  // overflow hour
  if (minute > constants.minutesInHour - 1) {
    hour += Math.floor(minute / constants.minutesInHour);
    minute = minute % constants.minutesInHour;
  }

  // overflow date
  if (hour > constants.hoursInDay - 1) {
    date += Math.floor(hour / constants.hoursInDay);
    hour = hour % constants.hoursInDay;
  }

  // overflow month
  // console.log('monthIndex', monthIndex, 'date', date, '> daysInMonth', months[monthIndex]);
  if (date > months[monthIndex]) {
    // console.log('date', date, months[monthIndex], date % months[monthIndex]);
    const newDate = date % months[monthIndex];
    // console.log('overflowed month', monthIndex + Math.floor(date / months[monthIndex]));
    monthIndex += Math.floor(date / months[monthIndex]);
    date = newDate;
  }

  // overflow year
  if (monthIndex > monthsInYear - 1) {
    year += Math.floor(monthIndex / constants.monthsInYearGregorian);
    monthIndex = monthIndex % constants.monthsInYearGregorian;
  }

  // console.log('overflow result', year, monthIndex, date);

  return {
    calendar,
    year,
    month: monthIndex,
    date: date,
    hour,
    minute,
    second,
    milisecond,
    timezoneOffset,
  };
}

/* from date parts and to date parts utils */
export function fromGregorianDateParts (
  utcYear: number,
  utcGregMonthIndex: number,
  utcGregDate: number,
  utcHour = 0,
  utcMinute = 0,
  utcSecond = 0,
  utcMilisecond = 0,
  timezoneOffset?: number
): number {
  const {
    year: gregYear,
    month: gregMonthIndex,
    date: gregDate,
    hour,
    minute,
    second,
    milisecond,
  } = overflowDateParts({
    calendar: constants.gregorianCalendarName,
    year: utcYear,
    month: utcGregMonthIndex,
    date: utcGregDate,
    hour: utcHour,
    minute: utcMinute,
    second: utcSecond,
    milisecond: utcMilisecond,
    timezoneOffset: timezoneOffset ?? new Date().getTimezoneOffset(),
  });

  const gregInMilis = datePartsToUnixMilis(
    constants.gregorianCalendarName,
    gregYear,
    gregMonthIndex,
    gregDate,
    hour,
    minute,
    second,
    milisecond
  );

  return gregInMilis;
}

export function fromDate13Parts (
  utcYear: number,
  utcMonth13Index = 0,
  utcDate13 = 1,
  utcHour = 0,
  utcMinute = 0,
  utcSecond = 0,
  utcMilisecond = 0,
  timezoneOffset?: number
): number {
  const localOffset = new Date().getTimezoneOffset();

  const {
    year: year13,
    month: month13Index,
    date: date13,
    hour,
    minute,
    second,
    milisecond,
  } = overflowDateParts({
    calendar: constants.date13CalendarName,
    year: utcYear,
    month: utcMonth13Index,
    date: utcDate13,
    hour: utcHour,
    minute: utcMinute,
    second: utcSecond,
    milisecond: utcMilisecond,
    timezoneOffset: timezoneOffset ?? localOffset,
  });

  const date13InMilis = datePartsToUnixMilis(
    constants.date13CalendarName,
    year13,
    month13Index,
    date13,
    hour,
    minute,
    second,
    milisecond
  );

  return date13InMilis;
}

/* from milis and ti milis utils */

export function date13PartsFromMilis (timestamp: number): DateParts {
  const gregDate = new Date(timestamp);

  const dateInfo = milisToDateInfo(timestamp);

  const year = dateInfo.utcYear;

  const dayOfYear = dateInfo.dayOfYear;

  let monthIndex = 0;
  let date = dayOfYear;

  const months = utils.getMonthLengths(year, constants.date13CalendarName);

  for (let i = 0; i < months.length; i++) {
    if (date <= months[i]) {
      monthIndex = i;
      break;
    }
    date -= months[i];
  }

  const hour = gregDate.getUTCHours();
  const minute = gregDate.getUTCMinutes();
  const second = gregDate.getUTCSeconds();
  const milisecond = gregDate.getUTCMilliseconds();

  const localOffset = new Date().getTimezoneOffset();

  return {
    calendar: constants.date13CalendarName,
    year,
    month: monthIndex,
    // fix 0 day
    date: date === 0 ? 1 : date,
    hour,
    minute,
    second,
    milisecond,
    timezoneOffset: localOffset,
  };
}

export function milisToDateInfo (unixMs: number): DateInfo {
  const date = new Date(unixMs);
  const utcYear = date.getUTCFullYear();
  const startOfYear = Date.UTC(utcYear, 0, 0);

  const dayOfYear = Math.floor((unixMs - startOfYear) / constants.milisecondsPerDay);

  const timeMs =
    unixMs - Date.UTC(utcYear, date.getUTCMonth(), date.getUTCDate());

  return {
    utcYear,
    dayOfYear,
    timeMs,
  };
}

export function datePartsToUnixMilis (
  type: CalendarType,
  year: number,
  monthIndex: number,
  date: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
  milisecond: number = 0
): number {
  const unixEpochYear = constants.unixEpochYear;

  let days = 0;

  for (let y = unixEpochYear; y < year; y++) {
    days += utils.getTotalDaysInYear(y);
  }

  for (let m = 0; m < monthIndex; m++) {
    days += utils.getDaysInMonth(year, m, type);
  }

  days += date - 1;

  const daysInMilis = days * constants.milisecondsPerDay;

  const timeInMilis = utils.timeToMilis(hour, minute, second, milisecond);

  const fullDateInMilis = daysInMilis + timeInMilis;

  return fullDateInMilis;
}

export function toGregorianDate (a: number | { getTime(): number }): Date {
  if (typeof a === 'number') {
    return new Date(a);
  }

  return new Date(a.getTime());
}
