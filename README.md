# date13 ![npm](https://img.shields.io/npm/v/date13?style=flat-square)

Date13 is a simple date library for JavaScript that provides a new class for 13-months calendar system. The library allows you to create, manipulate, format dates and is compatible with the standard JavaScript Date object.

## 13-Month Calendar System

The idea was inspired by the 13-month calendar system proposed by the International Fixed Calendar, which is a solar calendar consisting of 13 months of 28 days each (364 days in total), plus an extra day at the end of the year to make up the full 365 days.

This system is designed to fit extra days into last 13th month to simplify the calculation of dates:

- 12 months have 28 days
- The 13th month has 29 days (or 30 days in a leap years)
- Sum of all days in year is standard 365 days (or 366 days in a leap years)
- Each month starts on the same day of the week during the year
- Next year's calendar shifts 1 or 2 days forward and continues the 13 months cycle

## Features
- Simple and easy to use
- Zero dependency
- JS Date compatible
- TypeScript support

## Roadmap
- Timezone support
- Date formatting (separate library `date13-intl`)

## Installation

#### Install with npm, yarn or pnpm
```bash
npm install date13
```

Alternatively avaliable:
- Stable npm release on unpkg: https://unpkg.com/date13/dist/date13.js
- Unstable version on jsdelivr: https://cdn.jsdelivr.net/gh/koenigstag/date13/dist/date13.js

## Usage

#### module

```javascript
import { Date13 } from 'date13';

// Example: 0-based month index
const date1 = new Date13(2024, 11, 1); // December 1, 2024
// standard iso format
// for compatibility
console.log(date1.toISOString()); // "2024-12-01T00:00:00.000Z"
// date13 iso format
console.log(Date13.toDate13ISOString(date1)); // "2024-11-01T00:00:00.000Z"

// Example: 13th month is index 12
const date2 = new Date13(2024, 12, 1); // 13th month of 2024
// standard iso format
// is overflowed to next year
console.log(date2.toISOString()); // "2025-01-01T00:00:00.000Z"
// date13 iso format
console.log(Date13.toDate13ISOString(date2)); // "2024-13-01T00:00:00.000Z"
```

#### browser
```html
<script src="https://unpkg.com/date13/dist/date13.js"></script>
<script>
  // window.Date13 is available
  const date = new Date13(2025, 0, 1);
  console.log(Date13.toDate13ISOString(date1)); // "2025-01-01T00:00:00.000Z"
</script>
```

## API
### Date13 constructor
```javascript
constructor(); // current date
constructor(date: Date | Date13); // clone date
constructor(dateString: string); // parse date string
constructor(miliseconds: number); // unix timestamp in milliseconds
constructor(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number); // from date parts
```

### Date13 instance methods
```javascript
getUTCDate(): number; // get date (1-28 for 12 months, 1-29/30 for 13th month)
getUTCMonth(): number; // get 0-based month (0-12)
getUTCFullYear(): number; // get year
toISOString(): string; // convert to ISO 8601 format (same as standard Date)
toString(): string; // convert to string (same as standard Date)
... other `Date` interface methods
```

### Date13 static methods
```javascript
Date13.now(): Date13; // get current timestamp
Date13.parse(dateString: string): Date13; // parse date string to timestamp
Date13.fromDate(date: Date | Date13): Date13; // create date from standard Date
Date13.fromUnixMilliseconds(milliseconds: number): Date13; // create date from unix milliseconds
Date13.fromUnixSeconds(seconds: number): Date13; // create date from unix seconds
Date13.toDate13ISOString(date: Date13): string; // convert to date13 pseudo-iso format
Date13.fromDate13ISOString(dateString: string): Date13; // parse date13 pseudo-iso format
```


