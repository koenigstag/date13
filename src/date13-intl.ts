import constants from "./constants";
import utils from "./utils";
import Date13Dictionary from "./intl/dictionary";

export interface Date13RangeFormatPart {
  type: Intl.DateTimeFormatPartTypes;
  value: string;
  source: "startRange" | "endRange" | "shared";
}

export class Date13TimeFormat {
  private locale: string;
  private options: Intl.DateTimeFormatOptions;

  constructor(locale: string | readonly string[] = "en", options: Intl.DateTimeFormatOptions = {}) {
    const canonicalLocales = Intl.getCanonicalLocales(locale);

    this.locale = canonicalLocales[0] || "en";
    this.options = options;
  }

  /* prototype */

  public resolvedOptions(): Intl.ResolvedDateTimeFormatOptions {
    const options = Intl.DateTimeFormat(
      this.locale,
      this.options
    ).resolvedOptions();

    return {
      ...options,
      calendar: constants.date13CalendarName,
    };
  }

  public format(date: Date): string {
    this.validateDateParam(date);

    if (date instanceof Date) {
      return Intl.DateTimeFormat(this.locale, this.options).format(date);
    }

    const text = this.formatToParts(date)
      .map((part) => part.value)
      .join("");

    const formattedRTL = Date13Dictionary.applyTextDirection({
      text,
      locale: this.locale,
    });

    return formattedRTL;
  }

  public formatRange(start: Date, end: Date): string {
    this.validateDateParam(start);
    this.validateDateParam(end);

    const text = this.formatRangeToParts(start, end)
      .map((part) => part.value)
      .join("");

    const formattedRTL = Date13Dictionary.applyTextDirection({
      text,
      locale: this.locale,
    });

    return formattedRTL;
  }

  public formatToParts(dateParam: Date | any): Intl.DateTimeFormatPart[] {
    this.validateDateParam(dateParam);

    if (dateParam instanceof Date) {
      return Intl.DateTimeFormat(this.locale, this.options).formatToParts(
        dateParam
      );
    }

    const opts = this.resolvedOptions();
    const parts: Intl.DateTimeFormatPart[] = [];

    const { year, month, date, hour, minute, second } = dateParam.toDateParts();

    const locale = this.locale;
    const useGenitive = Date13TimeFormat.isGenitiveOrder(opts);

    const pushLiteral = (val: string = " ") =>
      parts.push({ type: "literal", value: val });

    // TODO opts.era, opts.numberingSystem, opts.timeZoneName

    // weekday
    if (opts.weekday) {
      const weekday = new Intl.DateTimeFormat(locale, {
        weekday: opts.weekday as Intl.DateTimeFormatOptions["weekday"],
        timeZone: opts.timeZone,
      }).format(new Date(dateParam.getTime()));
      parts.push({ type: "weekday", value: weekday });
      pushLiteral();
    }

    // day
    if (opts.day) {
      const dayStr =
        opts.day === "2-digit"
          ? utils.pad(date, "start", 2, "0")
          : String(date);
      parts.push({ type: "day", value: dayStr });
      pushLiteral();
    }

    // month
    if (opts.month) {
      const monthNames = Date13TimeFormat.getMonthNames(
        locale,
        opts.month as Intl.DateTimeFormatOptions["month"],
        useGenitive
      );
      const monthValue = monthNames[month];
      parts.push({ type: "month", value: monthValue });
      pushLiteral();
    }

    // year
    if (opts.year) {
      const yearStr =
        opts.year === "2-digit" ? String(year).slice(-2) : String(year);
      parts.push({ type: "year", value: yearStr });
    }

    // hour
    if (opts.hour) {
      const hourVal = opts.hour12 ? utils.get12HourFormat(hour) : hour;

      const hourStr =
        opts.hour === "2-digit"
          ? utils.pad(hourVal, "start", 2, "0")
          : String(hourVal);
      parts.push({ type: "hour", value: hourStr });
      pushLiteral();
    }

    // minute
    if (opts.minute) {
      const minuteStr =
        opts.minute === "2-digit"
          ? utils.pad(minute, "start", 2, "0")
          : String(minute);
      parts.push({ type: "minute", value: minuteStr });
      pushLiteral();
    }

    // second
    if (opts.second) {
      const secondStr =
        opts.second === "2-digit"
          ? utils.pad(second, "start", 2, "0")
          : String(second);
      parts.push({ type: "second", value: secondStr });
      pushLiteral();
    }

    // remove last space
    if (utils.arrayAt(parts, -1)?.type === "literal") {
      parts.pop();
    }

    return parts;
  }

  public formatRangeToParts(start: Date, end: Date): Date13RangeFormatPart[] {
    const startParts = this.formatToParts(start);
    const endParts = this.formatToParts(end);

    const parts: Date13RangeFormatPart[] = [];

    // find the point of divergence
    let i = 0;
    while (
      i < startParts.length &&
      i < endParts.length &&
      startParts[i].value === endParts[i].value &&
      startParts[i].type === endParts[i].type
    ) {
      parts.push({ ...startParts[i], source: "shared" });
      i++;
    }

    // if there are still different parts, insert a separator
    if (i < startParts.length || i < endParts.length) {
      parts.push({ type: "literal", value: " – ", source: "shared" });
    }

    // add unique parts for start
    for (let j = i; j < startParts.length; j++) {
      parts.push({ ...startParts[j], source: "startRange" });
    }

    // add unique parts for end
    for (let j = i; j < endParts.length; j++) {
      parts.push({ ...endParts[j], source: "endRange" });
    }

    return parts;
  }

  /* static */

  public static supportedLocalesOf(locales: string | string[]): string[] {
    const available = Date13Dictionary.getSupportedLocales();
    const inputLocales = Array.isArray(locales) ? locales : [locales];

    return inputLocales.filter((loc) => {
      const lower = loc.toLowerCase();
      return (
        available.includes(lower) || // full match
        available.includes(lower.split("-")[0]) // base locale match
      );
    });
  }

  private static isGenitiveOrder(
    format: Intl.ResolvedDateTimeFormatOptions
  ): boolean {
    if (!format.day || !format.month) return false;

    const testDate = new Date(2025, 0, 5);
    const parts = new Intl.DateTimeFormat(format.locale, {
      day: format.day as Intl.DateTimeFormatOptions["day"],
      month: format.month as Intl.DateTimeFormatOptions["day"],
    }).formatToParts(testDate);

    const dayIndex = parts.findIndex((p) => p.type === "day");
    const monthIndex = parts.findIndex((p) => p.type === "month");

    // day before month → genitive
    return dayIndex < monthIndex;
  }

  private static getMonthNames(
    locale: string,
    format: Intl.DateTimeFormatOptions["month"] = "long",
    isGenitive?: boolean
  ): string[] {
    const monthNames = utils.calculateMonthNames(locale, format, isGenitive);

    monthNames.push(this.getMonth13Name(locale, format, isGenitive));

    return monthNames;
  }

  private static getMonth13Name(
    locale: string,
    format: Intl.DateTimeFormatOptions["month"] = "long",
    isGenitive?: boolean
  ): string {
    const localeConfig = Date13Dictionary.getMonth13Locale(locale);

    const digit = constants.monthsInYear13 + 1;

    if (format === "short") {
      return localeConfig.short;
    } else if (format === "narrow") {
      return localeConfig.narrow;
    } else if (format === "numeric") {
      return String(digit);
    } else if (format === "2-digit") {
      return utils.pad(digit, "start", 2, "0");
    }

    return isGenitive ? localeConfig.genitive : localeConfig.long;
  }

  private validateDateParam(date: any): void {
    if (
      (!!date && typeof date !== "object") ||
      typeof date.getTime !== "function" ||
      typeof date.valueOf !== "function"
    ) {
      throw new TypeError("Argument must be a Date type");
    }
  }
}

(Intl as any).Date13TimeFormat = Date13TimeFormat;
