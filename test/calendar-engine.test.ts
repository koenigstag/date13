import { describe, it, expect } from "vitest";
import {
  CalendarEngine,
  GregorianCalendarConfig,
} from "../src/calendar-engine";
import { DateParts } from "../src/types";

describe("calendar engine tests", () => {
  it("should create a calendar engine instance", () => {
    expect(new CalendarEngine(GregorianCalendarConfig)).toBeInstanceOf(
      CalendarEngine
    );
    expect(CalendarEngine.Gregorian).toBeInstanceOf(CalendarEngine);
  });

  it("should format date correctly", () => {
    const calendarEngine = CalendarEngine.Gregorian;
    const date = new Date("2023-10-01T12:00:00Z");
    const formattedDate = calendarEngine.toDateParts(date.getTime());

    expect(formattedDate).toEqual({
      calendar: "gregorian",
      year: 2023,
      month: 9, // 0-based month
      date: 1,
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    } satisfies DateParts);
  });

  it("should handle invalid date gracefully", () => {
    const calendarEngine = CalendarEngine.Gregorian;
    const date = new Date("invalid-date-string");
    const formattedDate = calendarEngine.toDateParts(date.getTime());

    expect(formattedDate).toEqual({
      calendar: "gregorian",
      year: NaN,
      month: NaN,
      date: NaN,
      hour: NaN,
      minute: NaN,
      second: NaN,
      millisecond: NaN,
    } satisfies DateParts);
  });

  it("should parse date correctly", () => {
    const calendarEngine = CalendarEngine.Gregorian;
    const dateParts: DateParts = {
      calendar: "gregorian",
      year: 2023,
      month: 9, // 0-based month
      date: 1,
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    };

    const parsedDate = calendarEngine.fromDateParts(dateParts);
    const expectedDate = new Date("2023-10-01T12:00:00Z").getTime();
    expect(parsedDate).toEqual(expectedDate);
  });

  it("should handle invalid date parts gracefully", () => {
    const calendarEngine = CalendarEngine.Gregorian;
    const dateParts: DateParts = {
      calendar: "gregorian",
      year: 2023,
      month: 13, // overflow month
      date: 1,
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    };

    const parsedDate = calendarEngine.fromDateParts(dateParts);
    const expectedDate = new Date(
      Date.UTC(
        dateParts.year,
        dateParts.month,
        dateParts.date,
        dateParts.hour,
        dateParts.minute,
        dateParts.second,
        dateParts.millisecond
      )
    ).getTime();
    expect(parsedDate).toEqual(expectedDate);
  });

  it("should handle leap years correctly", () => {
    const calendarEngine = CalendarEngine.Gregorian;
    const dateParts: DateParts = {
      calendar: "gregorian",
      year: 2020, // leap year
      month: 1, // February
      date: 29,
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    };

    const parsedDate = calendarEngine.fromDateParts(dateParts);
    const expectedDate = new Date("2020-02-29T12:00:00Z").getTime();
    expect(parsedDate).toEqual(expectedDate);
  });

  it("should handle non-leap years correctly", () => {
    const calendarEngine = CalendarEngine.Gregorian;
    const dateParts: DateParts = {
      calendar: "gregorian",
      year: 2021, // non-leap year
      month: 1, // February
      date: 29, // overflow date for non-leap year
      hour: 12,
      minute: 0,
      second: 0,
      millisecond: 0,
    };

    const parsedDate = calendarEngine.fromDateParts(dateParts);
    const expectedDate = new Date("2021-03-01T12:00:00Z").getTime();
    expect(parsedDate).toEqual(expectedDate);
  });
});
