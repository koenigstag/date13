import constants from '../constants';

export type CalendarType =
  | typeof constants.gregorianCalendarName
  | typeof constants.date13CalendarName;

export type DateParts = {
  calendar: string;
  year: number;
  month: number; // 0-based
  date: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
};

export type Delta = Partial<{
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}>;

export type DateInfo = {
  utcYear: number;
  dayOfYear: number;
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
