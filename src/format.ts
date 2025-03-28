import { constants } from './constants';
import { Date13 } from './date13';

const isoPattern = `yyyy-MM-ddTHH:mm:ss.SSSZ`;

function getReplacersFromDate (date: Date13 | Date) {
  const padStart_2_0 = (val: any) => String(val).padStart(2, '0');
  const padEnd_2_0 = (val: any) => String(val).padEnd(2, '0');
  const padEnd_3_0 = (val: any) => String(val).padEnd(3, '0');

  const replacers = {
    yyyy() { return date.getUTCFullYear() },
    YYYY() { return date.getUTCFullYear() },
    M() { return date.getUTCMonth() + 1 },
    MM() { return padStart_2_0(this.M()) },
    d() { return date.getUTCDate() },
    dd() { return padStart_2_0(this.d()) },

    h() { return get12HourFormat(date).hours12 },
    hh() { return padStart_2_0(this.h()) },
    a() { return get12HourFormat(date).period.toLowerCase() },
    aa() { return this.a() },
    A() { return this.a().toUpperCase() },
    AA() { return this.A() },

    H() { return date.getUTCHours() },
    HH() { return padStart_2_0(this.H()) },
    m() { return date.getUTCMinutes() },
    mm() { return padStart_2_0(this.m()) },
    s() { return date.getUTCSeconds() },
    ss() { return padStart_2_0(this.s()) },

    milis() { return date.getUTCMilliseconds() },
    S() { return Math.floor(this.milis() / 100) },
    SS() { return padEnd_2_0(Math.floor(this.milis() / 10)) },
    SSS() { return padEnd_3_0(this.milis()) },
  };

  return replacers;
}

export function get12HourFormat(date: Date | Date13) {
  const hours24 = date.getHours();
  const hours12 = (hours24 % 12) || 12;
  const period = hours24 < 12 ? 'AM' : 'PM';
  return { hours12, period };
}

export function toDate13ISOString (date: Date13) {
  if (!(date instanceof Date13)) {
    throw new TypeError('Argument must be a Date type');
  }

  let transformedPattern = isoPattern;

  const replacers = getReplacersFromDate(date);

  for (const [key, val] of Object.entries(replacers)) {
    transformedPattern = transformedPattern.replace(
      new RegExp(key, 'gi'),
      String(val())
    );
  }

  return transformedPattern;
}

export function fromDate13ISOString (str: string): Date13 {
  if (typeof str != 'string') {
    throw new TypeError('Argument must be a string');
  }

  if (!constants.isoRegexp().test(str)) {
    return new Date13(Date.parse(str));
  }

  const isoString = str;

  const match =
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?(Z)?$/.exec(
      isoString
    );

  if (!match) throw new Error('Invalid Date13 ISO string');

  const [, yearStr, monthStr, dayStr, h, m, s, ms, z] = match;

  const year = parseInt(yearStr);
  const month = parseInt(monthStr) - 1;
  const day = parseInt(dayStr);

  let hours = h !== undefined ? parseInt(h) : 0;
  let minutes = m !== undefined ? parseInt(m) : 0;
  let seconds = s !== undefined ? parseInt(s) : 0;
  let milliseconds = ms !== undefined ? parseInt(ms.padEnd(3, '0')) : 0;

  if (!z) {
    const local = new Date(
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
      milliseconds
    );
    hours = local.getUTCHours();
    minutes = local.getUTCMinutes();
    seconds = local.getUTCSeconds();
    milliseconds = local.getUTCMilliseconds();
  }

  return new Date13(year, month, day, hours, minutes, seconds, milliseconds);
}
