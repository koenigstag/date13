const constants = {
  calendarName: 'ordo13',
  monthsInYear: 13,
  daysInMonthAverage: 28,
  daysInLastMonthNormalYear: 29,
  daysInLastMonthLeapYear: 30,
  daysInNormalYear: 365,
  daysInLeapYear: 366,
  lastMonthDefaultNameEn: 'Lunary',
  lastMonthDefaultShortNameEn: 'Lun',
  unixEpochYear: 1970,
  milisecondsPerDay: 24 * 60 * 60 * 1000,
  isoRegexp: /^\d{4}-\d{1,2}-\d{1,2}/i,
  isoPattern: 'yyyy-MM-ddTHH:mm:ss.SSSZ',
  month13IsoRegexp: /^\d{4}-13-/i,
};

export default constants;
