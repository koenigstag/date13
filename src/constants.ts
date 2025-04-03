const constants = {
  // date13 specific
  date13CalendarName: 'ordo13',
  monthsInYear13: 13,
  daysInMonthAverage: 28,
  daysInLastMonthNormalYear: 29,
  daysInLastMonthLeapYear: 30,
  month13IsoRegexp: /^\d{4}-13-/i,

  // axiomatic
  gregorianCalendarName: 'gregorian',
  milisInSecond: 1000,
  secondsInMinute: 60,
  minutesInHour: 60,
  hoursInDay: 24,
  milisecondsPerDay: 24 * 60 * 60 * 1000,
  daysInWeek: 7,
  monthsInYearGregorian: 12,
  daysInNormalYear: 365,
  daysInLeapYear: 366,
  unixEpochYear: 1970,
  unixEpochWeekday: 4, // Thursday

  // utils
  isoRegexp: /^\d{4}-\d{1,2}-\d{1,2}/i,
  isoPattern: 'yyyy-MM-ddTHH:mm:ss.SSSZ',
} as const;

export default constants;
