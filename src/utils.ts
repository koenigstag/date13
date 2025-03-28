import { constants } from './constants';

export function getMonthNamesEn (short = false): string[] {
  const formatter = new Intl.DateTimeFormat('en', {
    month: short ? 'short' : 'long',
    timeZone: 'UTC',
  });

  const names: string[] = [];

  for (let month = 0; month < 12; month++) {
    const date = new Date(Date.UTC(constants.unixEpochYear(), month, 1));
    names.push(formatter.format(date));
  }

  return names;
}

export function getDaysSinceEpoch (date: Date): number {
  const epoch = Date.UTC(constants.unixEpochYear(), 0, 1);

  const utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );

  return Math.floor((utc - epoch) / 86400000);
}

export function isLeapYear (year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
