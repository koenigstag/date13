import utils from './utils';

export type Month13Dictionary = {
  [locale: string]: {
    long: string;
    short: string;
    narrow?: string;
    genitive?: string;
  };
};

class Date13Dictionary {
  public static fallbackLocale = 'en';

  public static rtlLocales = [
    'ar',
    'he',
    'fa',
    'ur',
  ];

  public static getDictionaryRaw (): Month13Dictionary {
    return utils.objCloneDeep(this.dictionary);
  }

  public static getSupportedLocales (): string[] {
    return Object.keys(this.getDictionaryRaw());
  }

  // fallback to 'en' if locale not found
  public static getDictionaryWithFallback (): Month13Dictionary {
    return new Proxy(this.getDictionaryRaw(), {
      get (target, locale: string) {
        // key normilizing: "en-US" → "en-us"
        const lang = locale.toLowerCase();

        // lookup for exact match
        const exact = target[lang];
        if (exact) return exact;

        // lookup for base locale
        const baseLang = lang.split('-')[0];
        if (target[baseLang]) return target[baseLang];

        // fallback to "en"
        return target[Date13Dictionary.fallbackLocale];
      },
    });
  }

  // seed optional config values
  public static getMonth13Locale (
    locale: string
  ): Required<Month13Dictionary[string]> {
    const dict = this.getDictionaryWithFallback();
    const config = dict[locale];

    if (!config) {
      throw new Error(`Locale "${locale}" not found`);
    }

    return {
      ...config,
      genitive: config.genitive || config.long,
      narrow: config.narrow || config.long.slice(0, 1).toUpperCase(),
    };
  }

  public static applyTextDirection (props: { text: string, locale: string }): string {
    const { text, locale } = props;

    const base = locale.toLowerCase().split('-')[0];

    if (this.rtlLocales.includes(base)) {
      // apply RTL direction
      return utils.wrapTextWithRtl(text);
    }

    return text; // LTR by default
  }

  private static readonly dictionary: Month13Dictionary = {
    en: { long: 'Lunary', short: 'Lun' },
    fr: { long: 'Lunaire', short: 'Lun' },
    ja: { long: '13月', short: '13', narrow: '13' },
    ko: { long: '13월', short: '13', narrow: '13' },
    zh: { long: '13月', short: '13', narrow: '13' },
    es: { long: 'Lunar', short: 'Lun' },
    it: { long: 'Lunare', short: 'Lun' },
    pt: { long: 'Lunar', short: 'Lun' },
    tr: { long: 'Lunary', short: 'Lun' },
    ar: {
      long: 'لُونَارِي',
      short: 'ل',
      narrow: '١٣',
      genitive: 'لُونَارِي',
    },
    he: { long: 'לונרי', short: 'לונ', narrow: '13' },
    th: { long: 'ลูนาร์', short: 'ลูน', narrow: '13' },
    vi: { long: 'Lunar', short: 'Lun', narrow: '13' },
    id: { long: 'Lunar', short: 'Lun' },
    ro: { long: 'Lunar', short: 'Lun' },
    da: { long: 'Lunær', short: 'Lun' },
    el: { long: 'Λουνάριος', short: 'Λουν' },
    sl: { long: 'Lunaren', short: 'Lun' },
    no: { long: 'Lunær', short: 'Lun' },
    et: { long: 'Lunaarne', short: 'Lun' },
    sw: { long: 'Lunär', short: 'Lun' },
    ms: { long: 'Lunar', short: 'Lun' },
    hi: {
      long: 'लूनारी',
      short: 'लू',
      narrow: '१३',
      genitive: 'लूनारी के',
    },
    ru: {
      long: 'Лунарий',
      short: 'Лун',
      genitive: 'Лунария',
    },
    uk: {
      long: 'Лунарій',
      short: 'Лун',
      genitive: 'Лунарія',
    },
    be: {
      long: 'Лунарый',
      short: 'Лун',
      genitive: 'Лунарыя',
    },
    ka: {
      long: 'ლუნარი',
      short: 'ლუნ',
      genitive: 'ლუნარის',
    },
    pl: {
      long: 'Lunar',
      short: 'Lun',
      genitive: 'Lunara',
    },
    cs: {
      long: 'Lunár',
      short: 'Lun',
      genitive: 'Lunáru',
    },
    sk: {
      long: 'Lunár',
      short: 'Lun',
      genitive: 'Lunára',
    },
    sr: {
      long: 'Лунар',
      short: 'Лун',
      genitive: 'Лунара',
    },
    hr: {
      long: 'Lunar',
      short: 'Lun',
      genitive: 'Lunara',
    },
    bg: {
      long: 'Лунар',
      short: 'Лун',
      genitive: 'Лунара',
    },
    lt: {
      long: 'Lunaris',
      short: 'Lun',
      genitive: 'Lunario',
    },
    lv: {
      long: 'Lunāris',
      short: 'Lun',
      genitive: 'Lunāra',
    },
    hu: {
      long: 'Lunár',
      short: 'Lun',
      genitive: 'Lunár',
    },
    de: {
      long: 'Lunar',
      short: 'Lun',
      genitive: 'Lunars',
    },
    fi: {
      long: 'Lunari',
      short: 'Lun',
      genitive: 'Lunarin',
    },
    is: {
      long: 'Lúnar',
      short: 'Lún',
      genitive: 'Lúnars',
    },
  };
}

export default Date13Dictionary;
