import constants from './constants';

export type CalendarType =
  | typeof constants.gregorianCalendarName
  | typeof constants.date13CalendarName;

export type DateParts = {
  calendar: CalendarType;
  year: number;
  month: number; // 0-based
  date: number;
  hour: number;
  minute: number;
  second: number;
  milisecond: number;
  timezoneOffset: number; // in minutes
};

export type DateInfo = {
  utcYear: number;
  dayOfYearIndex: number;
  timeMs: number;
};

export type Date13MonthLengthArray = [
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
  29 | 30
];

export type GregorianMonthLengthArray = [
  31,
  28 | 29,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31
];

export type MonthLengthArrayType<T extends CalendarType> = T extends 'ordo13'
  ? Date13MonthLengthArray
  : T extends 'gregorian'
  ? GregorianMonthLengthArray
  : never;
