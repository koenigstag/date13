import { describe, it, expect } from 'vitest';
import { milisToDateInfo } from '../src/convert';

describe('convert utils', () => {
  it('should convert 0 value to 1st day', () => {
    const dateInfo = milisToDateInfo(0);

    expect(dateInfo.utcYear).toBe(1970);
    expect(dateInfo.dayOfYearIndex).toBe(0);
  });

  it('should convert timestamp value dayOfYearIndex', () => {
    const dateInfo = milisToDateInfo(1743638400000);

    expect(dateInfo.utcYear).toBe(2025);
    expect(dateInfo.dayOfYearIndex).toBe(92);
  });
});
