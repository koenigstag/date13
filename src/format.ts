import utils from './utils';

export function getReplacersFromDate (date: Date) {
  const padStart_2_0 = (val: any) => utils.pad(val, 'start', 2, '0');
  const padEnd_2_0 = (val: any) => utils.pad(val, 'end', 2, '0');
  const padEnd_3_0 = (val: any) => utils.pad(val, 'end', 3, '0');

  const replacers = {
    yyyy () {
      return date.getUTCFullYear();
    },
    YYYY () {
      return date.getUTCFullYear();
    },
    M () {
      return date.getUTCMonth() + 1;
    },
    MM () {
      return padStart_2_0(this.M());
    },
    d () {
      return date.getUTCDate();
    },
    dd () {
      return padStart_2_0(this.d());
    },

    h () {
      return utils.get12HourFormat(date).hours12;
    },
    hh () {
      return padStart_2_0(this.h());
    },
    a () {
      return utils.get12HourFormat(date).period.toLowerCase();
    },
    aa () {
      return this.a();
    },
    A () {
      return this.a().toUpperCase();
    },
    AA () {
      return this.A();
    },

    H () {
      return date.getUTCHours();
    },
    HH () {
      return padStart_2_0(this.H());
    },
    m () {
      return date.getUTCMinutes();
    },
    mm () {
      return padStart_2_0(this.m());
    },
    s () {
      return date.getUTCSeconds();
    },
    ss () {
      return padStart_2_0(this.s());
    },

    milis () {
      return date.getUTCMilliseconds();
    },
    S () {
      return Math.floor(this.milis() / 100);
    },
    SS () {
      return padEnd_2_0(Math.floor(this.milis() / 10));
    },
    SSS () {
      return padEnd_3_0(this.milis());
    },
  };

  return replacers;
}
