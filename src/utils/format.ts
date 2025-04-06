import utils from '.';

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
    MM () {
      return padStart_2_0(this.M());
    },
    M () {
      return date.getUTCMonth() + 1;
    },
    dd () {
      return padStart_2_0(this.d());
    },
    d () {
      return date.getUTCDate();
    },
    hh () {
      return padStart_2_0(this.h());
    },
    h () {
      return utils.get12HourFormat(date.getUTCHours()).hours12;
    },
    aa () {
      return this.a();
    },
    a () {
      return utils.get12HourFormat(date.getUTCHours()).period.toLowerCase();
    },
    AA () {
      return this.A();
    },
    A () {
      return this.a().toUpperCase();
    },

    HH () {
      return padStart_2_0(this.H());
    },
    H () {
      return date.getUTCHours();
    },
    mm () {
      return padStart_2_0(this.m());
    },
    m () {
      return date.getUTCMinutes();
    },
    ss () {
      return padStart_2_0(this.s());
    },
    s () {
      return date.getUTCSeconds();
    },

    milis () {
      return date.getUTCMilliseconds();
    },
    SSS () {
      return padEnd_3_0(this.milis());
    },
    SS () {
      return padEnd_2_0(Math.floor(this.milis() / 10));
    },
    S () {
      return Math.floor(this.milis() / 100);
    },
  };

  return replacers;
}

export function formatDate (date: Date, format: string) {
  const replacers = getReplacersFromDate(date);

  const transformed = replaceTokens(format, replacers);

  return transformed;
}

export function replaceTokens (
  format: string,
  replacers: Record<string, () => string | number>
) {
  const tokens = Object.keys(replacers).sort((a, b) => b.length - a.length);

  let result = '';
  let i = 0;

  while (i < format.length) {
    let matched = false;

    for (const token of tokens) {
      if (format.startsWith(token, i)) {
        const value = String(replacers[token].bind(replacers)());
        result += value;
        i += token.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      result += format[i];
      i += 1;
    }
  }

  return result;
}
